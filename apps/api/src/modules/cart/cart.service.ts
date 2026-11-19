import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbStoreService, CartRecord } from '@/database/db-store.service';
import { CouponsService } from '@/modules/coupons/coupons.service';
import * as crypto from 'crypto';

@Injectable()
export class CartService {
  constructor(
    private readonly store: DbStoreService,
    private readonly couponsService: CouponsService
  ) {}

  async getOrCreateCart(userId?: string, sessionToken?: string): Promise<CartRecord> {
    let cart: CartRecord | undefined;

    if (userId) {
      cart = this.store.carts.find((c) => c.userId === userId);
      if (!cart) {
        cart = {
          id: 'cart_' + crypto.randomUUID(),
          userId,
          items: [],
          updatedAt: new Date(),
        };
        this.store.carts.push(cart);
      }
      return cart;
    }

    if (sessionToken) {
      cart = this.store.carts.find((c) => c.sessionToken === sessionToken);
      if (!cart) {
        cart = {
          id: 'cart_' + crypto.randomUUID(),
          sessionToken,
          items: [],
          updatedAt: new Date(),
        };
        this.store.carts.push(cart);
      }
      return cart;
    }

    cart = {
      id: 'cart_' + crypto.randomUUID(),
      sessionToken: 'gst_' + crypto.randomBytes(16).toString('hex'),
      items: [],
      updatedAt: new Date(),
    };
    this.store.carts.push(cart);
    return cart;
  }

  async addItem(userId?: string, sessionToken?: string, productId?: string, quantity: number = 1) {
    if (!productId) {
      throw new BadRequestException('Product ID is required');
    }

    const product = this.store.products.find((p) => p.id === productId || p.slug === productId);
    if (!product || product.status !== 'ACTIVE' || !product.isPurchasable) {
      throw new NotFoundException('Product is not available for purchase');
    }

    if (product.stock < quantity) {
      throw new BadRequestException(`Only ${product.stock} units available in stock`);
    }

    const cart = await this.getOrCreateCart(userId, sessionToken);
    const existingIndex = cart.items.findIndex((i) => i.productId === product.id);

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      if (product.stock < newQty) {
        throw new BadRequestException(`Cannot add more than ${product.stock} units`);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({ productId: product.id, quantity });
    }

    cart.updatedAt = new Date();
    return this.formatCart(cart);
  }

  async updateItemQuantity(
    userId?: string,
    sessionToken?: string,
    productId?: string,
    quantity: number = 1
  ) {
    const product = this.store.products.find((p) => p.id === productId || p.slug === productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.getOrCreateCart(userId, sessionToken);
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== product.id);
    } else {
      if (product.stock < quantity) {
        throw new BadRequestException(`Only ${product.stock} units available in stock`);
      }
      const existing = cart.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity = quantity;
      } else {
        cart.items.push({ productId: product.id, quantity });
      }
    }

    cart.updatedAt = new Date();
    return this.formatCart(cart);
  }

  async removeItem(userId?: string, sessionToken?: string, productId?: string) {
    const cart = await this.getOrCreateCart(userId, sessionToken);
    const product = this.store.products.find((p) => p.id === productId || p.slug === productId);
    const targetId = product ? product.id : productId;

    cart.items = cart.items.filter((i) => i.productId !== targetId);
    cart.updatedAt = new Date();
    return this.formatCart(cart);
  }

  async mergeCart(userId: string, guestItems: { productId: string; quantity: number }[]) {
    const userCart = await this.getOrCreateCart(userId);

    for (const gItem of guestItems) {
      const product = this.store.products.find(
        (p) => p.id === gItem.productId || p.slug === gItem.productId
      );
      if (!product || product.status !== 'ACTIVE' || !product.isPurchasable) continue;

      const existing = userCart.items.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + gItem.quantity, product.stock);
      } else {
        userCart.items.push({
          productId: product.id,
          quantity: Math.min(gItem.quantity, product.stock),
        });
      }
    }

    userCart.updatedAt = new Date();
    return this.formatCart(userCart);
  }

  async clearCart(userId?: string, sessionToken?: string) {
    const cart = await this.getOrCreateCart(userId, sessionToken);
    cart.items = [];
    cart.updatedAt = new Date();
  }

  // Authoritative Backend Price & Total Calculation
  async calculateTotals(
    items: { productId: string; quantity: number }[],
    paymentMethod: 'PREPAID' | 'COD' = 'PREPAID',
    couponCode?: string,
    pinCode?: string,
    userId?: string
  ) {
    let subtotal = 0;
    const detailedItems: any[] = [];

    for (const item of items) {
      const product = this.store.products.find(
        (p) => p.id === item.productId || p.slug === item.productId
      );
      if (!product || product.status !== 'ACTIVE') {
        throw new BadRequestException(`Product '${item.productId}' is not available`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stock}`
        );
      }

      // Backend authoritative price: sellingPrice (or discountPrice if lower)
      const unitPrice =
        product.discountPrice && product.discountPrice < product.sellingPrice
          ? product.discountPrice
          : product.sellingPrice;

      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      detailedItems.push({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        mrp: product.mrp,
        unitPrice,
        quantity: item.quantity,
        subtotal: itemTotal,
        image: product.images[0]?.url || '',
        bottleSize: product.bottleSize,
      });
    }

    // Shipping fee rules from database settings
    const settings = this.store.settings;
    let shippingFee = 0;
    if (subtotal < settings.freeShippingThreshold && subtotal > 0) {
      shippingFee = settings.standardShippingFee;
    }

    // COD handling fee rules
    let codFee = 0;
    let isCodAvailable = settings.codEnabled;

    if (paymentMethod === 'COD') {
      if (!settings.codEnabled) {
        throw new BadRequestException('Cash on Delivery is currently disabled.');
      }
      if (settings.restrictedPinCodes.includes(pinCode || '')) {
        throw new BadRequestException(
          `Cash on Delivery is not available for PIN code ${pinCode}. Please choose Prepaid.`
        );
      }
      if (subtotal < settings.minCodOrderValue) {
        throw new BadRequestException(
          `Minimum order value for COD is ₹${settings.minCodOrderValue}. Current subtotal is ₹${subtotal}.`
        );
      }
      if (subtotal > settings.maxCodOrderValue) {
        throw new BadRequestException(
          `Maximum order value for COD is ₹${settings.maxCodOrderValue}. Please choose Prepaid.`
        );
      }
      codFee = settings.codHandlingFee;
    }

    // Coupon discount calculation
    let discountTotal = 0;
    let couponDetails: any = null;

    if (couponCode && couponCode.trim()) {
      try {
        const couponResult = await this.couponsService.validateAndCalculateDiscount(
          couponCode,
          subtotal,
          userId
        );
        if (couponResult.isValid) {
          discountTotal = couponResult.discount;
          couponDetails = couponResult;
        }
      } catch (err: any) {
        throw new BadRequestException(err.message || 'Invalid coupon code');
      }
    }

    const grandTotal = Math.max(0, subtotal + shippingFee + codFee - discountTotal);

    return {
      items: detailedItems,
      subtotal,
      shippingFee,
      freeShippingThreshold: settings.freeShippingThreshold,
      amountNeededForFreeShipping: Math.max(0, settings.freeShippingThreshold - subtotal),
      codFee,
      isCodAvailable,
      discountTotal,
      couponDetails,
      grandTotal,
      currency: 'INR',
    };
  }

  private async formatCart(cart: CartRecord) {
    const calc = await this.calculateTotals(cart.items);
    return {
      id: cart.id,
      sessionToken: cart.sessionToken,
      ...calc,
    };
  }
}

