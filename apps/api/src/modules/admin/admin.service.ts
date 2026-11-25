import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DbStoreService, ProductRecord } from '@/database/db-store.service';
import { ShiprocketService } from '@/modules/shipping/shiprocket.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  AdminLoginDto,
  CreateProductDto,
  UpdateProductPriceDto,
  CreateCouponDto,
  UpdateCouponDto,
  UpdateShippingSettingsDto,
  UpdateCodSettingsDto,
  UpdatePaymentSettingsDto,
  UpdateStorefrontSettingsDto,
  UpdateOrderStatusDto,
} from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly store: DbStoreService,
    private readonly shiprocketService: ShiprocketService
  ) {}

  async login(dto: AdminLoginDto) {
    const admin = this.store.adminUsers.find(
      (a) => a.email.toLowerCase() === dto.email.trim().toLowerCase() && a.isActive
    );

    if (!admin) {
      throw new UnauthorizedException('Invalid admin email or password');
    }

    const isValid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid admin email or password');
    }

    const token = 'adm_sess_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    this.store.sessions.push({
      token,
      userId: admin.id,
      expiresAt,
    });

    this.store.logAdminAction(
      admin.email,
      'ADMIN_LOGIN',
      'AdminUser',
      admin.id,
      null,
      { role: admin.role }
    );

    return {
      success: true,
      message: 'Admin authenticated successfully',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  // 11A. Admin Dashboard Overview Stats
  getDashboardStats() {
    const orders = this.store.orders;
    const totalOrders = orders.length;

    // Filter confirmed/paid or active orders for revenue
    const revenueOrders = orders.filter((o) => o.orderStatus !== 'CANCELLED');
    const totalSales = revenueOrders.reduce((acc, o) => acc + o.grandTotal, 0);

    const pendingOrders = orders.filter((o) =>
      ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING'].includes(o.orderStatus)
    ).length;

    const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
    const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;
    const prepaidOrders = orders.filter((o) => o.paymentMethod === 'PREPAID').length;
    const codOrders = orders.filter((o) => o.paymentMethod === 'COD').length;

    // Bestseller calculations
    const productStats: Record<string, { name: string; unitsSold: number; revenue: number }> = {};
    for (const p of this.store.products) {
      productStats[p.id] = { name: p.name, unitsSold: 0, revenue: 0 };
    }

    for (const ord of revenueOrders) {
      for (const item of ord.items) {
        if (!productStats[item.productId]) {
          productStats[item.productId] = { name: item.productName, unitsSold: 0, revenue: 0 };
        }
        productStats[item.productId].unitsSold += item.quantity;
        productStats[item.productId].revenue += item.subtotal;
      }
    }

    const bestSellers = Object.values(productStats).sort((a, b) => b.unitsSold - a.unitsSold);
    const lowStockProducts = this.store.products.filter((p) => p.stock <= 20);

    const recentOrders = orders.slice(0, 10).map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerSnapshot.name || 'Anonymous',
      customerPhone: o.customerSnapshot.phone,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      grandTotal: o.grandTotal,
      createdAt: o.createdAt,
    }));

    return {
      totalOrders,
      totalSales,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      prepaidOrders,
      codOrders,
      bestSellers,
      lowStockProducts: lowStockProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        stock: p.stock,
      })),
      recentOrders,
    };
  }

  // 11B. Product Management
  getAllProducts() {
    return this.store.products;
  }

  updateProductPrice(adminEmail: string, slugOrId: string, dto: UpdateProductPriceDto) {
    const product = this.store.products.find(
      (p) => p.id === slugOrId || p.slug.toLowerCase() === slugOrId.toLowerCase()
    );
    if (!product) {
      throw new NotFoundException(`Product '${slugOrId}' not found`);
    }

    const prevSnapshot = {
      sellingPrice: product.sellingPrice,
      mrp: product.mrp,
      discountPrice: product.discountPrice,
      stock: product.stock,
      status: product.status,
    };

    product.sellingPrice = dto.sellingPrice;
    if (dto.mrp !== undefined) product.mrp = dto.mrp;
    if (dto.discountPrice !== undefined) product.discountPrice = dto.discountPrice;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.status !== undefined) product.status = dto.status;
    product.updatedAt = new Date();

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_PRODUCT_PRICE_AND_STOCK',
      'Product',
      product.id,
      prevSnapshot,
      {
        sellingPrice: product.sellingPrice,
        mrp: product.mrp,
        discountPrice: product.discountPrice,
        stock: product.stock,
        status: product.status,
      }
    );

    return {
      success: true,
      message: `Product '${product.name}' updated successfully. Selling price is now ₹${product.sellingPrice}`,
      product,
    };
  }

  createProduct(adminEmail: string, dto: CreateProductDto) {
    const slug = (dto.slug || dto.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existing = this.store.products.find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase()
    );
    if (existing) {
      throw new BadRequestException(`A product with slug '${slug}' already exists`);
    }

    const mrp = dto.mrp || Math.round(dto.sellingPrice * 1.35);
    const images =
      dto.images && dto.images.length > 0
        ? dto.images.map((img, idx) => ({
            id: `img_${slug}_${idx + 1}`,
            url: img.url,
            altText: img.altText || `${dto.name} Flacon`,
            isPrimary: idx === 0,
          }))
        : [
            {
              id: `img_${slug}_1`,
              url: dto.imageUrl || '/images/banners/hero-desktop-4k.jpg',
              altText: `${dto.name} Luxury Fragrance`,
              isPrimary: true,
            },
          ];

    const newProduct: ProductRecord = {
      id: `prod_${slug}_${Date.now()}`,
      name: dto.name.trim(),
      slug,
      description: dto.description.trim(),
      mrp,
      sellingPrice: dto.sellingPrice,
      discountPrice: dto.discountPrice,
      status: dto.status || 'ACTIVE',
      category: dto.category || 'Everyday Fragrance',
      occasion: dto.occasion || 'Daily Wear, Special Occasions',
      brandPersonality: dto.brandPersonality || 'Signature, Sophisticated, Long Lasting',
      bottleSize: dto.bottleSize || '50ml Eau de Parfum',
      isPurchasable: (dto.status || 'ACTIVE') === 'ACTIVE',
      stock: dto.stock !== undefined ? dto.stock : 100,
      images,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.store.products.unshift(newProduct);

    this.store.logAdminAction(
      adminEmail,
      'CREATE_PRODUCT',
      'Product',
      newProduct.id,
      null,
      newProduct
    );

    return {
      success: true,
      message: `Product '${newProduct.name}' created successfully`,
      product: newProduct,
    };
  }

  deleteProduct(adminEmail: string, slugOrId: string) {
    const idx = this.store.products.findIndex(
      (p) => p.id === slugOrId || p.slug.toLowerCase() === slugOrId.toLowerCase()
    );
    if (idx === -1) {
      throw new NotFoundException(`Product '${slugOrId}' not found`);
    }

    const removed = this.store.products[idx];
    this.store.products.splice(idx, 1);

    this.store.logAdminAction(
      adminEmail,
      'DELETE_PRODUCT',
      'Product',
      removed.id,
      removed,
      null
    );

    return {
      success: true,
      message: `Product '${removed.name}' removed successfully`,
    };
  }

  // 11C. Coupons Management
  getAllCoupons() {
    return this.store.coupons;
  }

  createCoupon(adminEmail: string, dto: CreateCouponDto) {
    const code = dto.code.trim().toUpperCase();
    if (this.store.coupons.some((c) => c.code === code)) {
      throw new BadRequestException(`Coupon code '${code}' already exists`);
    }

    const coupon = {
      id: 'cpn_' + crypto.randomUUID(),
      code,
      name: dto.name.trim(),
      discountType: dto.discountType,
      discountValue: dto.discountValue,
      minOrderValue: dto.minOrderValue,
      maxDiscount: dto.maxDiscount,
      usageLimit: dto.usageLimit,
      perUserLimit: dto.perUserLimit ?? 1,
      usedCount: 0,
      startDate: new Date(),
      endDate: new Date(dto.endDate),
      isActive: dto.isActive ?? true,
    };

    this.store.coupons.push(coupon);
    this.store.logAdminAction(adminEmail, 'CREATE_COUPON', 'Coupon', coupon.id, null, coupon);

    return { success: true, message: `Coupon '${code}' created successfully`, coupon };
  }

  toggleCoupon(adminEmail: string, id: string) {
    const coupon = this.store.coupons.find((c) => c.id === id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    const prev = coupon.isActive;
    coupon.isActive = !coupon.isActive;

    this.store.logAdminAction(
      adminEmail,
      'TOGGLE_COUPON_ACTIVE',
      'Coupon',
      coupon.id,
      { isActive: prev },
      { isActive: coupon.isActive }
    );

    return {
      success: true,
      message: `Coupon '${coupon.code}' is now ${coupon.isActive ? 'ACTIVE' : 'INACTIVE'}`,
      coupon,
    };
  }

  deleteCoupon(adminEmail: string, id: string) {
    const coupon = this.store.coupons.find((c) => c.id === id);
    if (!coupon) throw new NotFoundException('Coupon not found');

    this.store.coupons = this.store.coupons.filter((c) => c.id !== id);
    this.store.logAdminAction(adminEmail, 'DELETE_COUPON', 'Coupon', id, coupon, null);

    return { success: true, message: 'Coupon deleted successfully' };
  }

  // 11D. Shipping Settings
  updateShippingSettings(adminEmail: string, dto: UpdateShippingSettingsDto) {
    const prev = {
      freeShippingThreshold: this.store.settings.freeShippingThreshold,
      standardShippingFee: this.store.settings.standardShippingFee,
    };

    this.store.settings.freeShippingThreshold = dto.freeShippingThreshold;
    this.store.settings.standardShippingFee = dto.standardShippingFee;

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_SHIPPING_SETTINGS',
      'StoreSettings',
      'shipping',
      prev,
      dto
    );

    return {
      success: true,
      message: `Shipping settings updated: Free shipping above ₹${dto.freeShippingThreshold}, standard fee ₹${dto.standardShippingFee}`,
      settings: this.store.settings,
    };
  }

  // 11E. COD Settings
  updateCodSettings(adminEmail: string, dto: UpdateCodSettingsDto) {
    const prev = {
      codEnabled: this.store.settings.codEnabled,
      codHandlingFee: this.store.settings.codHandlingFee,
      minCodOrderValue: this.store.settings.minCodOrderValue,
      maxCodOrderValue: this.store.settings.maxCodOrderValue,
    };

    this.store.settings.codEnabled = dto.codEnabled;
    this.store.settings.codHandlingFee = dto.codHandlingFee;
    this.store.settings.minCodOrderValue = dto.minCodOrderValue;
    this.store.settings.maxCodOrderValue = dto.maxCodOrderValue;
    if (dto.restrictedPinCodes) {
      this.store.settings.restrictedPinCodes = dto.restrictedPinCodes;
    }

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_COD_SETTINGS',
      'StoreSettings',
      'cod',
      prev,
      dto
    );

    return {
      success: true,
      message: `COD settings updated: COD ${dto.codEnabled ? 'ENABLED' : 'DISABLED'}, handling fee ₹${dto.codHandlingFee}`,
      settings: this.store.settings,
    };
  }

  // 11F. Payment Settings
  updatePaymentSettings(adminEmail: string, dto: UpdatePaymentSettingsDto) {
    const prev = {
      prepaidEnabled: this.store.settings.prepaidEnabled,
      codEnabled: this.store.settings.codEnabled,
    };

    this.store.settings.prepaidEnabled = dto.prepaidEnabled;
    this.store.settings.codEnabled = dto.codEnabled;

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_PAYMENT_SETTINGS',
      'StoreSettings',
      'payments',
      prev,
      dto
    );

    return {
      success: true,
      message: 'Payment settings updated successfully',
      settings: this.store.settings,
    };
  }

  // 11G. Storefront Settings
  updateStorefrontSettings(adminEmail: string, dto: UpdateStorefrontSettingsDto) {
    const prev = {
      announcementBarMessage: this.store.settings.announcementBarMessage,
      storePhone: this.store.settings.storePhone,
      storeEmail: this.store.settings.storeEmail,
    };

    this.store.settings.announcementBarMessage = dto.announcementBarMessage;
    if (dto.storePhone) this.store.settings.storePhone = dto.storePhone;
    if (dto.storeEmail) this.store.settings.storeEmail = dto.storeEmail;

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_STOREFRONT_SETTINGS',
      'StoreSettings',
      'storefront',
      prev,
      dto
    );

    return {
      success: true,
      message: 'Storefront announcement and contact details updated successfully',
      settings: this.store.settings,
    };
  }

  // 11H. Customer Management
  getAllCustomers(search?: string) {
    let users = this.store.users;
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      users = users.filter(
        (u) =>
          u.phone.includes(q) ||
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    return users.map((u) => {
      const userOrders = this.store.orders.filter((o) => o.userId === u.id);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.grandTotal, 0);
      const addresses = this.store.addresses.filter((a) => a.userId === u.id);

      return {
        id: u.id,
        phone: u.phone,
        name: u.name,
        email: u.email,
        isBlocked: u.isBlocked,
        totalOrders: userOrders.length,
        totalSpent,
        addressesCount: addresses.length,
        createdAt: u.createdAt,
      };
    });
  }

  toggleBlockCustomer(adminEmail: string, userId: string) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) throw new NotFoundException('Customer not found');

    const prev = user.isBlocked;
    user.isBlocked = !user.isBlocked;

    this.store.logAdminAction(
      adminEmail,
      'TOGGLE_CUSTOMER_RESTRICTION',
      'User',
      user.id,
      { isBlocked: prev },
      { isBlocked: user.isBlocked }
    );

    return {
      success: true,
      message: `Customer account ${user.phone} is now ${user.isBlocked ? 'RESTRICTED' : 'ACTIVE'}`,
      isBlocked: user.isBlocked,
    };
  }

  // 11I. Order Management
  getAllOrders(filters: {
    status?: string;
    paymentMethod?: string;
    search?: string;
  } = {}) {
    let orders = this.store.orders;

    if (filters.status) {
      orders = orders.filter((o) => o.orderStatus === filters.status);
    }

    if (filters.paymentMethod) {
      orders = orders.filter((o) => o.paymentMethod === filters.paymentMethod);
    }

    if (filters.search) {
      const q = filters.search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerSnapshot.phone.includes(q) ||
          (o.customerSnapshot.name && o.customerSnapshot.name.toLowerCase().includes(q))
      );
    }

    return orders;
  }

  updateOrderStatus(adminEmail: string, orderId: string, dto: UpdateOrderStatusDto) {
    const order = this.store.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) throw new NotFoundException('Order not found');

    const prevStatus = order.orderStatus;
    order.orderStatus = dto.orderStatus;

    if (dto.orderStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
      order.paymentStatus = 'PAID';
    }

    if (dto.orderStatus === 'CANCELLED') {
      // Restore stock
      for (const item of order.items) {
        const prod = this.store.products.find((p) => p.id === item.productId);
        if (prod) prod.stock += item.quantity;
      }
    }

    if (dto.trackingAwb && order.shipment) {
      order.shipment.awbNumber = dto.trackingAwb;
    }
    if (dto.courierName && order.shipment) {
      order.shipment.courierName = dto.courierName;
    }
    if (dto.notes) {
      order.notes = dto.notes;
    }
    order.updatedAt = new Date();

    // Synchronize real-time tracking events and Amazon/Flipkart checkpoints
    this.shiprocketService.syncTrackingEventsForStatus(order, dto.orderStatus);

    this.store.logAdminAction(
      adminEmail,
      'UPDATE_ORDER_STATUS',
      'Order',
      order.id,
      { orderStatus: prevStatus },
      { orderStatus: order.orderStatus, notes: dto.notes }
    );

    return {
      success: true,
      message: `Order ${order.orderNumber} status changed from ${prevStatus} to ${order.orderStatus}`,
      order,
    };
  }

  getAuditLogs() {
    return this.store.auditLogs;
  }

  exportOrdersToCsv(): string {
    const orders = this.store.orders;
    const headers = [
      'Order Number',
      'Date',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Status',
      'Payment Method',
      'Payment Status',
      'Subtotal',
      'Discount',
      'Shipping Fee',
      'COD Fee',
      'Grand Total',
      'Items',
      'City',
      'State',
      'PIN Code',
    ];

    const rows = orders.map((o) => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toISOString()}"`,
      `"${o.customerSnapshot.name || ''}"`,
      `"${o.customerSnapshot.phone}"`,
      `"${o.customerSnapshot.email || ''}"`,
      `"${o.orderStatus}"`,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      o.subtotal,
      o.discountTotal,
      o.shippingFee,
      o.codFee,
      o.grandTotal,
      `"${o.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}"`,
      `"${o.addressSnapshot.city}"`,
      `"${o.addressSnapshot.state}"`,
      `"${o.addressSnapshot.pinCode}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

