import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  discountPrice?: number;
  status: 'ACTIVE' | 'COMING_SOON' | 'INACTIVE';
  category: string;
  occasion?: string;
  brandPersonality?: string;
  bottleSize: string;
  isPurchasable: boolean;
  images: { id: string; url: string; altText: string; isPrimary: boolean }[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRecord {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressRecord {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  houseBuilding: string;
  streetLocality: string;
  city: string;
  state: string;
  pinCode: string;
  deliveryInstructions?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItemRecord {
  productId: string;
  quantity: number;
}

export interface CartRecord {
  id: string;
  userId?: string;
  sessionToken?: string;
  items: CartItemRecord[];
  updatedAt: Date;
}

export interface OrderItemRecord {
  productId: string;
  productName: string;
  productSku: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  orderStatus:
    | 'PENDING'
    | 'PAYMENT_PENDING'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'PACKED'
    | 'SHIPPED'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUND_INITIATED'
    | 'REFUNDED'
    | 'FAILED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod: 'PREPAID' | 'COD';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customerSnapshot: {
    name?: string;
    phone: string;
    email?: string;
  };
  addressSnapshot: {
    fullName: string;
    phone: string;
    houseBuilding: string;
    streetLocality: string;
    city: string;
    state: string;
    pinCode: string;
    deliveryInstructions?: string;
  };
  items: OrderItemRecord[];
  subtotal: number;
  discountTotal: number;
  shippingFee: number;
  codFee: number;
  grandTotal: number;
  couponCode?: string;
  notes?: string;
  shipment?: {
    awbNumber?: string;
    courierName?: string;
    status: string;
    pickupLocation: string;
    trackingEvents: { status: string; activity: string; location?: string; timestamp: Date }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CouponRecord {
  id: string;
  code: string;
  name: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  applicableProductSlugs?: string[];
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'ORDER_MANAGER' | 'PRODUCT_MANAGER';
  isActive: boolean;
  createdAt: Date;
}

export interface AuditLogRecord {
  id: string;
  adminEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue?: any;
  ipAddress?: string;
  createdAt: Date;
}

export interface StoreSettingsRecord {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  currency: string;
  announcementBarMessage: string;
  freeShippingThreshold: number;
  standardShippingFee: number;
  codShippingFee: number;
  codHandlingFee: number;
  codEnabled: boolean;
  prepaidEnabled: boolean;
  minCodOrderValue: number;
  maxCodOrderValue: number;
  restrictedPinCodes: string[];
}

@Injectable()
export class DbStoreService implements OnModuleInit {
  private readonly logger = new Logger(DbStoreService.name);

  // In-memory data store for state-management
  public products: ProductRecord[] = [];
  public users: UserRecord[] = [];
  public sessions: { token: string; userId: string; expiresAt: Date }[] = [];
  public otps: {
    id: string;
    phone: string;
    hashedOtp: string;
    devOtp?: string;
    attempts: number;
    isUsed: boolean;
    expiresAt: Date;
    createdAt: Date;
  }[] = [];
  public addresses: AddressRecord[] = [];
  public carts: CartRecord[] = [];
  public orders: OrderRecord[] = [];
  public coupons: CouponRecord[] = [];
  public adminUsers: AdminUserRecord[] = [];
  public auditLogs: AuditLogRecord[] = [];
  public settings: StoreSettingsRecord = {
    storeName: 'UNSULID® Fine Fragrances',
    storeEmail: 'concierge@unsulid.com',
    storePhone: '+91 98765 43210',
    currency: 'INR',
    announcementBarMessage: 'Free Shipping on Orders Above ₹999 | 100% Authentic Fragrances',
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    codShippingFee: 99,
    codHandlingFee: 50,
    codEnabled: true,
    prepaidEnabled: true,
    minCodOrderValue: 500,
    maxCodOrderValue: 10000,
    restrictedPinCodes: [],
  };

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialData();
  }

  private async seedInitialData() {
    // 1. Initial Products
    this.products = [
      {
        id: 'prod_high_class',
        name: 'HIGH CLASS',
        slug: 'high-class',
        description:
          'Meet HIGH CLASS, an everyday fragrance expression created for moments that deserve a little more sophistication.',
        mrp: 2499,
        sellingPrice: 1499,
        discountPrice: undefined,
        status: 'ACTIVE',
        category: 'Everyday Fragrance',
        occasion: 'College, Office, Daily Wear, Casual Outings',
        brandPersonality: 'Sophisticated, Fresh, Elegant, Modern',
        bottleSize: '50ml Eau de Parfum',
        isPurchasable: true,
        stock: 250,
        images: [
          {
            id: 'img_hc_1',
            url: '/images/products/high-class-front.jpg',
            altText: 'UNSULID HIGH CLASS Front View',
            isPrimary: true,
          },
          {
            id: 'img_hc_2',
            url: '/images/products/high-class-side.jpg',
            altText: 'UNSULID HIGH CLASS Profile',
            isPrimary: false,
          },
          {
            id: 'img_hc_3',
            url: '/images/products/high-class-closeup.jpg',
            altText: 'UNSULID HIGH CLASS Cap Detail',
            isPrimary: false,
          },
          {
            id: 'img_hc_4',
            url: '/images/products/high-class-lifestyle.jpg',
            altText: 'UNSULID HIGH CLASS Ritual Scene',
            isPrimary: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'prod_black',
        name: 'BLACK',
        slug: 'black',
        description:
          'A bold fragrance identity for evenings, celebrations, and unforgettable moments.',
        mrp: 2799,
        sellingPrice: 1699,
        discountPrice: undefined,
        status: 'ACTIVE',
        category: 'Evening Fragrance',
        occasion: 'Parties, Celebrations, Nightlife, Galas',
        brandPersonality: 'Nocturnal, Magnetic, Deep, Charismatic',
        bottleSize: '50ml Eau de Parfum',
        isPurchasable: true,
        stock: 180,
        images: [
          {
            id: 'img_bl_1',
            url: '/images/products/black-front.jpg',
            altText: 'UNSULID BLACK Front View',
            isPrimary: true,
          },
          {
            id: 'img_bl_2',
            url: '/images/products/black-side.jpg',
            altText: 'UNSULID BLACK Profile',
            isPrimary: false,
          },
          {
            id: 'img_bl_3',
            url: '/images/products/black-closeup.jpg',
            altText: 'UNSULID BLACK Cap Detail',
            isPrimary: false,
          },
          {
            id: 'img_bl_4',
            url: '/images/products/black-lifestyle.jpg',
            altText: 'UNSULID BLACK Ritual Scene',
            isPrimary: false,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 2. Initial Super Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@Unsulid2026!', salt);
    this.adminUsers = [
      {
        id: 'admin_super_1',
        email: 'admin@unsulid.com',
        name: 'UNSULID Super Admin',
        passwordHash,
        role: 'SUPER_ADMIN',
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: 'admin_order_1',
        email: 'orders@unsulid.com',
        name: 'UNSULID Order Desk',
        passwordHash,
        role: 'ORDER_MANAGER',
        isActive: true,
        createdAt: new Date(),
      },
    ];

    // 3. Initial Launch Coupons
    this.coupons = [
      {
        id: 'cpn_welcome10',
        code: 'WELCOME10',
        name: 'Inaugural Launch 10% Discount',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderValue: 999,
        maxDiscount: 500,
        usageLimit: 1000,
        perUserLimit: 1,
        usedCount: 0,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-12-31'),
        isActive: true,
      },
      {
        id: 'cpn_flat200',
        code: 'ROYAL200',
        name: 'Flat ₹200 Privilege Offer',
        discountType: 'FIXED',
        discountValue: 200,
        minOrderValue: 1499,
        usageLimit: 500,
        perUserLimit: 1,
        usedCount: 0,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-12-31'),
        isActive: true,
      },
    ];

    this.logger.log(
      `✨ Seeded default store data (2 Products, 2 Admin Users, 2 Coupons, Default Settings).`
    );
  }

  // Helper method to log admin actions
  logAdminAction(
    adminEmail: string,
    action: string,
    entityType: string,
    entityId: string,
    previousValue?: any,
    newValue?: any,
    ipAddress?: string
  ) {
    const log: AuditLogRecord = {
      id: 'audit_' + Math.random().toString(36).substring(2, 10),
      adminEmail,
      action,
      entityType,
      entityId,
      previousValue,
      newValue,
      ipAddress,
      createdAt: new Date(),
    };
    this.auditLogs.unshift(log);
    this.logger.log(`[AUDIT] ${adminEmail} performed ${action} on ${entityType}#${entityId}`);
    return log;
  }
}
