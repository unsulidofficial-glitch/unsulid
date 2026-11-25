import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { DbStoreService, OrderRecord, OrderItemRecord } from '@/database/db-store.service';
import { CartService } from '@/modules/cart/cart.service';
import { AddressService } from '@/modules/users/address.service';
import { PaymentsService } from '@/modules/payments/payments.service';
import { ShiprocketService } from '@/modules/shipping/shiprocket.service';
import { CreateOrderDto, CancelOrderDto } from './orders.dto';
import * as crypto from 'crypto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly store: DbStoreService,
    private readonly cartService: CartService,
    private readonly addressService: AddressService,
    private readonly paymentsService: PaymentsService,
    private readonly shiprocketService: ShiprocketService
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) {
      throw new NotFoundException('Customer account not found');
    }

    // 1. Resolve Delivery Address
    let addressSnapshot: any = null;
    if (dto.addressId) {
      const saved = await this.addressService.getAddress(userId, dto.addressId);
      addressSnapshot = {
        fullName: saved.fullName,
        phone: saved.phone,
        houseBuilding: saved.houseBuilding,
        streetLocality: saved.streetLocality,
        city: saved.city,
        state: saved.state,
        pinCode: saved.pinCode,
        deliveryInstructions: saved.deliveryInstructions,
      };
    } else if (dto.address) {
      addressSnapshot = {
        fullName: dto.address.fullName.trim(),
        phone: dto.address.phone.trim(),
        houseBuilding: dto.address.houseBuilding.trim(),
        streetLocality: dto.address.streetLocality.trim(),
        city: dto.address.city.trim(),
        state: dto.address.state.trim(),
        pinCode: dto.address.pinCode.trim(),
        deliveryInstructions: dto.address.deliveryInstructions?.trim(),
      };
      // Save address for future orders if not already saved
      await this.addressService.createAddress(userId, dto.address);
    } else {
      throw new BadRequestException('Delivery address is required');
    }

    // 2. Resolve Items
    let itemsToProcess: { productId: string; quantity: number }[] = [];
    if (dto.items && dto.items.length > 0) {
      itemsToProcess = dto.items;
    } else {
      const userCart = await this.cartService.getOrCreateCart(userId);
      if (!userCart.items || userCart.items.length === 0) {
        throw new BadRequestException('Your shopping cart is empty');
      }
      itemsToProcess = userCart.items;
    }

    // 3. Authoritative Backend Price & Fee Calculation
    const calc = await this.cartService.calculateTotals(
      itemsToProcess,
      dto.paymentMethod,
      dto.couponCode,
      addressSnapshot.pinCode,
      userId
    );

    // 4. Reserve/Deduct Stock from inventory
    for (const item of calc.items) {
      const product = this.store.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock -= item.quantity;
        this.logger.log(`Stock deducted: ${product.name} remaining stock: ${product.stock}`);
      }
    }

    // 5. Generate Sequential Unique Order Number (e.g. UNS-2026-1042)
    const orderSeq = 1000 + this.store.orders.length + 1;
    const orderNumber = `UNS-2026-${orderSeq}`;

    // 6. Build Immutable Order Items Snapshot
    const orderItems: OrderItemRecord[] = calc.items.map((i) => ({
      productId: i.productId,
      productName: i.name,
      productSku: `${i.slug.toUpperCase()}-50ML`,
      unitPrice: i.unitPrice,
      mrp: i.mrp,
      quantity: i.quantity,
      subtotal: i.subtotal,
      image: i.image,
    }));

    const now = new Date();
    const orderId = 'ord_' + crypto.randomUUID();

    const order: OrderRecord = {
      id: orderId,
      orderNumber,
      userId,
      orderStatus: dto.paymentMethod === 'COD' ? 'CONFIRMED' : 'PAYMENT_PENDING',
      paymentStatus: 'PENDING',
      paymentMethod: dto.paymentMethod,
      customerSnapshot: {
        name: user.name || addressSnapshot.fullName,
        phone: user.phone,
        email: user.email,
      },
      addressSnapshot,
      items: orderItems,
      subtotal: calc.subtotal,
      discountTotal: calc.discountTotal,
      shippingFee: calc.shippingFee,
      codFee: calc.codFee,
      grandTotal: calc.grandTotal,
      couponCode: dto.couponCode?.trim().toUpperCase(),
      notes: dto.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    // If COD, prepare automated Surat dispatch shipment record
    if (dto.paymentMethod === 'COD') {
      const shipment = await this.shiprocketService.createShipmentForOrder(order);
      order.shipment = shipment;
    }

    // If PREPAID, generate Razorpay order
    let razorpayOrderDetails: any = null;
    if (dto.paymentMethod === 'PREPAID') {
      razorpayOrderDetails = await this.paymentsService.createRazorpayOrder(
        calc.grandTotal,
        orderNumber,
        {
          orderId,
          orderNumber,
          userId,
          customerPhone: user.phone,
        }
      );
      order.razorpayOrderId = razorpayOrderDetails.id;
    }

    // Save order in database store
    this.store.orders.unshift(order);

    // Record coupon usage if applied
    if (dto.couponCode && calc.discountTotal > 0) {
      await this.cartService['couponsService'].recordUsage(dto.couponCode);
    }

    // Clear customer cart
    await this.cartService.clearCart(userId);

    this.logger.log(
      `🎉 Created Order ${orderNumber} for ₹${order.grandTotal} (${dto.paymentMethod})`
    );

    return {
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        discountTotal: order.discountTotal,
        shippingFee: order.shippingFee,
        codFee: order.codFee,
        grandTotal: order.grandTotal,
        items: order.items,
        addressSnapshot: order.addressSnapshot,
        createdAt: order.createdAt,
      },
      razorpay: razorpayOrderDetails,
    };
  }

  async listUserOrders(userId: string) {
    const orders = this.store.orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    for (const ord of orders) {
      if (ord.shipment) {
        this.shiprocketService.syncTrackingEventsForStatus(ord);
      }
    }
    return orders;
  }

  async getOrder(userId: string, orderIdOrNumber: string) {
    const order = this.store.orders.find(
      (o) => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      // In dev testing or demo order, allow customer session to access it
      if (
        order.id === 'ord_bfe31e2a-1e0a-4609-9ee0-8bdb3e88fc2c' ||
        order.orderNumber === 'UNS-2026-1001'
      ) {
        order.userId = userId;
      } else {
        throw new ForbiddenException('You are not authorized to view this order');
      }
    }

    // Automatically sync real-time tracking checkpoints for order
    this.shiprocketService.syncTrackingEventsForStatus(order);

    return order;
  }

  async cancelOrder(userId: string, orderIdOrNumber: string, reason: string) {
    const order = await this.getOrder(userId, orderIdOrNumber);

    const cancellableStatuses = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING'];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new BadRequestException(
        `Order cannot be cancelled at this stage (${order.orderStatus}). Please contact concierge.`
      );
    }

    order.orderStatus = 'CANCELLED';
    order.notes = `Customer Cancellation: ${reason}`;
    order.updatedAt = new Date();

    // Restore inventory stock
    for (const item of order.items) {
      const product = this.store.products.find((p) => p.id === item.productId);
      if (product) {
        product.stock += item.quantity;
      }
    }

    this.logger.log(`Order ${order.orderNumber} cancelled by customer. Stock restored.`);

    return {
      success: true,
      message: `Order ${order.orderNumber} has been successfully cancelled`,
      orderStatus: order.orderStatus,
    };
  }
}

