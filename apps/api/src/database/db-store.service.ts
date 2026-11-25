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
    estimatedDelivery?: string;
    deliveryOtp?: string;
    deliveryAssociate?: {
      name: string;
      phone: string;
      courier: string;
    };
    currentMilestoneIndex?: number;
    trackingEvents: {
      status: string;
      activity: string;
      location?: string;
      timestamp: Date;
      isCompleted?: boolean;
      isActive?: boolean;
    }[];
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

    // 4. Initial Seed Order (UNS-2026-1001) for Real-Time Tracking Demo
    const orderCreatedAt = new Date(Date.now() - 20 * 60 * 60 * 1000);
    this.orders.push({
      id: 'ord_bfe31e2a-1e0a-4609-9ee0-8bdb3e88fc2c',
      orderNumber: 'UNS-2026-1001',
      userId: 'usr_rajesh',
      orderStatus: 'OUT_FOR_DELIVERY',
      paymentStatus: 'PENDING',
      paymentMethod: 'COD',
      customerSnapshot: {
        name: 'Rajesh Kumar',
        phone: '9568845314',
        email: 'rajesh@unsulid.com',
      },
      addressSnapshot: {
        fullName: 'Rajesh Kumar',
        phone: '9568845314',
        houseBuilding: 'Flat 402, Royal Palms Residency',
        streetLocality: 'Ring Road, Near City Center',
        city: 'Surat',
        state: 'Gujarat',
        pinCode: '395007',
        deliveryInstructions: 'Fragrance batch. Please handle with care.',
      },
      items: [
        {
          productId: 'prod_high_class',
          productName: 'HIGH CLASS',
          productSku: 'HIGH-CLASS-50ML',
          unitPrice: 1499,
          mrp: 2499,
          quantity: 1,
          subtotal: 1499,
          image: '/images/products/high-class-front.jpg',
        },
      ],
      subtotal: 1499,
      discountTotal: 0,
      shippingFee: 0,
      codFee: 50,
      grandTotal: 1549,
      shipment: {
        awbNumber: 'AWB848319763',
        courierName: 'Delhivery Surface',
        status: 'OUT_FOR_DELIVERY',
        pickupLocation: 'UNSULID_SURAT',
        estimatedDelivery: 'Today by 7:00 PM',
        deliveryOtp: '4821',
        deliveryAssociate: {
          name: 'Vikram Sharma',
          phone: '+91 98721 04412',
          courier: 'Delhivery Surface',
        },
        currentMilestoneIndex: 3,
        trackingEvents: [
          {
            status: 'ORDER_PLACED',
            activity: 'Order confirmed and verified at UNSULID Concierge',
            location: 'Surat, Gujarat',
            timestamp: new Date(orderCreatedAt.getTime()),
            isCompleted: true,
          },
          {
            status: 'PACKED',
            activity: 'Fragrance batch hand-packed and inspected in climate-controlled vault',
            location: 'Surat Fragrance Facility',
            timestamp: new Date(orderCreatedAt.getTime() + 15 * 60 * 1000),
            isCompleted: true,
          },
          {
            status: 'AWB_GENERATED',
            activity: 'Airway bill AWB848319763 generated with Delhivery Surface',
            location: 'Surat Logistics Hub',
            timestamp: new Date(orderCreatedAt.getTime() + 30 * 60 * 1000),
            isCompleted: true,
          },
          {
            status: 'SHIPPED',
            activity: 'Dispatched from Surat Logistics Hub via line-haul express to Surat Delivery Center',
            location: 'Surat Express Line-Haul Terminal, Gujarat',
            timestamp: new Date(orderCreatedAt.getTime() + 2 * 60 * 60 * 1000),
            isCompleted: true,
          },
          {
            status: 'IN_TRANSIT',
            activity: 'Arrived at National Transit Transshipment Hub & automated sorting complete',
            location: 'Regional Hub, Western Logistics Corridor',
            timestamp: new Date(orderCreatedAt.getTime() + 6 * 60 * 60 * 1000),
            isCompleted: true,
          },
          {
            status: 'REACHED_CITY',
            activity: 'Package received at destination city delivery center (395007)',
            location: 'Surat Logistics Hub, Gujarat',
            timestamp: new Date(orderCreatedAt.getTime() + 14 * 60 * 60 * 1000),
            isCompleted: true,
          },
          {
            status: 'OUT_FOR_DELIVERY',
            activity: 'Out for delivery! Courier delivery executive (Vikram Sharma) has departed with your package',
            location: 'Surat Delivery Center — Delivering to Rajesh Kumar',
            timestamp: new Date(Date.now() - 35 * 60 * 1000),
            isCompleted: true,
            isActive: true,
          },
        ],
      },
      createdAt: orderCreatedAt,
      updatedAt: new Date(),
    });

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
