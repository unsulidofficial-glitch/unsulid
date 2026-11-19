# UNSULID® | Part 5 Master Implementation Delivery Report
## Complete E-Commerce Backend, Mobile OTP Authentication, Payment Gateways, Shiprocket Logistics & Advanced Admin Control Center

**Date:** November 15, 2026  
**Status:** Completed & Production Verified  
**Repository:** `UNSULID Monorepo (Next.js 14 + NestJS + PostgreSQL / Prisma)`

---

## 1. Project Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Storefront & Admin (apps/web - Next.js 14)"]
        UI_Store["Luxury Storefront (Parts 1-4 Preserved)"]
        UI_Cart["Dynamic Cart & Free Shipping Bar"]
        UI_Checkout["Address Management & Razorpay / COD Checkout"]
        UI_Account["Customer Dashboard & Shiprocket Tracking"]
        UI_Admin["Advanced Admin Control Center (7 Modules)"]
    end

    subgraph API ["Backend API Server (apps/api - NestJS REST)"]
        AuthModule["Mobile OTP Auth & HTTP-only Cookies"]
        CartModule["Authoritative Price & Fee Calculation Engine"]
        OrdersModule["Order Lifecycle & Immutable Snapshots"]
        PaymentsModule["Razorpay Gateway & Webhook Signature Verification"]
        ShippingModule["Shiprocket Surat Warehouse Dispatch Service"]
        AdminModule["Role-Based Admin Control & Audit Logs"]
        SettingsModule["Dynamic Storefront & Shipping Rules Engine"]
    end

    subgraph Data ["Database Tier (PostgreSQL + Prisma ORM)"]
        PostgresDB[("PostgreSQL Database (Neon Free Tier / Direct URL)")]
        PrismaORM["Prisma Client (14 Relational Models)"]
        ResilientStore["Resilient Seed & Dev State Manager"]
    end

    subgraph External ["External Service Gateways"]
        SMS["SMS Gateway (Console Dev / Fast2SMS / MSG91 / 2Factor)"]
        RZP["Razorpay Payment Gateway (UPI / Cards / Net Banking)"]
        SR["Shiprocket Logistics Hub (Surat Origin Pickup)"]
    end

    UI_Store --> API
    UI_Cart --> API
    UI_Checkout --> API
    UI_Account --> API
    UI_Admin --> API

    API --> PrismaORM --> PostgresDB
    API -.-> ResilientStore

    AuthModule --> SMS
    PaymentsModule --> RZP
    ShippingModule --> SR
```

---

## 2. Updated Project Folder Structure

```
e:\unsulid\
├── apps/
│   ├── api/                                # NestJS Backend Application
│   │   ├── prisma/
│   │   │   └── schema.prisma              # 14 Relational PostgreSQL Prisma Models
│   │   ├── src/
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   ├── prisma.service.ts      # Resilient PostgreSQL connection & state manager
│   │   │   │   └── db-store.service.ts    # Seed data & centralized database store
│   │   │   ├── modules/
│   │   │   │   ├── admin/                 # Control center, KPIs, price updater, audit trail
│   │   │   │   │   ├── admin.controller.ts
│   │   │   │   │   ├── admin.dto.ts
│   │   │   │   │   ├── admin.guard.ts     # Role-based guards (SUPER_ADMIN, etc.)
│   │   │   │   │   ├── admin.module.ts
│   │   │   │   │   └── admin.service.ts
│   │   │   │   ├── auth/                  # Customer Mobile + 6-Digit OTP Auth
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.dto.ts
│   │   │   │   │   ├── auth.guard.ts      # Session cookie / Bearer auth guard
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   └── auth.service.ts
│   │   │   │   ├── cart/                  # Backend-calculated cart totals & stock
│   │   │   │   ├── coupons/               # Promo codes & discount engine
│   │   │   │   ├── orders/                # Immutable snapshots & status lifecycle
│   │   │   │   ├── payments/              # Razorpay orders, signatures, webhooks, COD
│   │   │   │   ├── products/              # Catalog API (HIGH CLASS & BLACK)
│   │   │   │   ├── settings/              # Dynamic store settings
│   │   │   │   ├── shipping/              # Shiprocket Surat factory integration
│   │   │   │   └── users/                 # Customer delivery addresses CRUD
│   │   │   ├── app.module.ts
│   │   │   └── main.ts                    # Helmet, CORS, CookieParser, ValidationPipe
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                                # Next.js 14 Frontend Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── (store)/
│       │   │   │   ├── cart/page.tsx      # Full luxury cart & free shipping bar
│       │   │   │   ├── checkout/page.tsx  # Address manager, Razorpay & COD checkout
│       │   │   │   ├── product/[slug]/    # HIGH CLASS & BLACK PDPs (Preserved)
│       │   │   │   ├── track-order/       # Public order tracking page
│       │   │   │   └── page.tsx           # Luxury Homepage (Preserved)
│       │   │   ├── account/
│       │   │   │   ├── addresses/page.tsx # Manage delivery addresses
│       │   │   │   ├── orders/            # Order history list
│       │   │   │   │   └── [id]/page.tsx  # Order detail & Shiprocket timeline
│       │   │   │   ├── profile/page.tsx   # Edit name, email, view mobile
│       │   │   │   └── page.tsx           # Customer concierge hub
│       │   │   └── admin/
│       │   │       ├── audit-logs/page.tsx# Immutable audit trail
│       │   │       ├── coupons/page.tsx   # Offers & promo code manager
│       │   │       ├── customers/page.tsx # Client relations & access control
│       │   │       ├── login/page.tsx     # Admin authentication
│       │   │       ├── orders/page.tsx    # Order fulfillment desk & CSV export
│       │   │       ├── products/page.tsx  # Live price & stock editor
│       │   │       ├── settings/page.tsx  # Shipping thresholds, COD rules, storefront
│       │   │       ├── layout.tsx         # Admin sidebar & security shell
│       │   │       └── page.tsx           # Real-time KPI dashboard
│       │   ├── components/
│       │   │   └── auth/
│       │   │       └── OtpModal.tsx       # 6-Digit Mobile OTP Modal Dialog
│       │   ├── context/
│       │   │   ├── AuthContext.tsx        # Customer auth state & session manager
│       │   │   └── CartContext.tsx        # API-backed cart calculations
│       │   └── lib/
│       │       └── api.ts                 # Typed API client
│       └── package.json
├── scripts/
│   └── test-part5-e2e.ps1                 # Automated E2E verification test suite
├── .env.example                           # Root configuration template
└── README.md
```

---

## 3. Database Schema & Prisma Models

Defined in `apps/api/prisma/schema.prisma`:
- **`User`**: Customer phone (unique normalized `+91XXXXXXXXXX`), name, email, `isBlocked`, timestamps.
- **`UserSession`**: Secure 30-day session token, user agent, IP address, expiration.
- **`OtpVerification`**: 6-digit hashed OTP, attempts count (max 3), expiry (5 mins), `isUsed`.
- **`AdminUser`**: Role-based administrative accounts (`SUPER_ADMIN`, `ADMIN`, `ORDER_MANAGER`, `PRODUCT_MANAGER`), bcrypt password hashes.
- **`Address`**: Delivery addresses linked to customer, default flag, 6-digit Indian PIN code validation.
- **`Product`**: HIGH CLASS & BLACK with exact MRP, selling price, discount price, status (`ACTIVE`), stock, bottle size (`50ml`).
- **`ProductImage`**: Image URL, alt text, primary flag.
- **`Cart` & `CartItem`**: Persistent customer carts and guest session carts with automatic merge on login.
- **`Order`**: Sequential identifier (`UNS-2026-XXXX`), order status lifecycle, payment status, payment method, immutable JSON snapshots of customer contact, delivery address, and product items at time of purchase.
- **`OrderItem`**: Frozen unit price snapshot, MRP snapshot, SKU snapshot, subtotal.
- **`Payment`**: Method (`RAZORPAY` or `COD`), transaction references, signature verification.
- **`Shipment`**: Shiprocket shipment reference, AWB number, courier partner (`BlueDart Express`, `Delhivery`), Surat origin pickup.
- **`TrackingEvent`**: Step-by-step logistics milestones with timestamps and locations.
- **`Coupon`**: Promo codes (`WELCOME10`, `ROYAL200`), discount type (`PERCENTAGE` / `FIXED`), min order value, max discount cap, usage counters.
- **`StoreSettings`**: Free shipping threshold, standard shipping fees, COD handling fee, COD availability, announcement message.
- **`AuditLog`**: Tamper-evident admin action log recording admin identity, action, entity, timestamp, and before/after values.

---

## 4. Completed REST API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| **POST** | `/api/auth/send-otp` | Generate & dispatch 6-digit OTP to Indian mobile | Public |
| **POST** | `/api/auth/verify-otp` | Verify OTP, issue HTTP-only cookie & session | Public |
| **GET** | `/api/auth/me` | Fetch authenticated customer profile | Customer |
| **PUT** | `/api/auth/profile` | Update customer name and email | Customer |
| **POST** | `/api/auth/logout` | Terminate session & clear cookies | Customer |
| **GET** | `/api/addresses` | List customer saved delivery addresses | Customer |
| **POST** | `/api/addresses` | Save new delivery address | Customer |
| **PUT** | `/api/addresses/:id` | Update delivery address | Customer |
| **DELETE** | `/api/addresses/:id` | Delete delivery address | Customer |
| **PUT** | `/api/addresses/:id/default`| Set default delivery address | Customer |
| **GET** | `/api/products` | Retrieve active launch fragrances | Public |
| **GET** | `/api/products/:slug` | Retrieve fragrance details by slug | Public |
| **GET** | `/api/cart` | Retrieve current cart | Optional |
| **POST** | `/api/cart/items` | Add item to cart | Optional |
| **PUT** | `/api/cart/items/:productId`| Update item quantity | Optional |
| **DELETE** | `/api/cart/items/:productId`| Remove item from cart | Optional |
| **POST** | `/api/cart/merge` | Merge guest items into customer cart on login | Customer |
| **POST** | `/api/cart/calculate` | Backend-authoritative calculation of totals & fees | Public |
| **POST** | `/api/coupons/apply` | Validate promo code and calculate discount | Optional |
| **POST** | `/api/orders` | Create order (Prepaid or COD) | Customer |
| **GET** | `/api/orders` | List customer order history | Customer |
| **GET** | `/api/orders/:id` | Retrieve customer order detail & snapshots | Customer |
| **POST** | `/api/orders/:id/cancel` | Cancel order & restore inventory stock | Customer |
| **GET** | `/api/orders/:id/tracking` | Retrieve Shiprocket tracking timeline | Customer |
| **POST** | `/api/payments/razorpay/verify` | Verify Razorpay payment signature & confirm order | Customer |
| **POST** | `/api/payments/razorpay/webhook`| Idempotent webhook handler for Razorpay events | Secret Header |
| **GET** | `/api/settings/public` | Public store configuration, shipping thresholds | Public |
| **POST** | `/api/admin/auth/login` | Authenticate administrator with email & password | Public |
| **GET** | `/api/admin/auth/me` | Retrieve authenticated admin profile & role | Admin |
| **POST** | `/api/admin/auth/logout` | Clear admin authentication | Admin |
| **GET** | `/api/admin/dashboard/stats` | Real-time database KPI metrics & revenue | Admin |
| **GET** | `/api/admin/products` | Retrieve all products for management | Admin |
| **PUT** | `/api/admin/products/:slugOrId/price` | Change product prices (reflects live on storefront) | Admin / Product Mgr |
| **GET** | `/api/admin/coupons` | List all promotional coupons | Admin |
| **POST** | `/api/admin/coupons` | Create promotional coupon | Admin |
| **PUT** | `/api/admin/coupons/:id/toggle` | Toggle coupon active/inactive status | Admin |
| **DELETE** | `/api/admin/coupons/:id` | Permanently remove promotional coupon | Super Admin |
| **PUT** | `/api/admin/settings/shipping` | Update free shipping threshold & standard fees | Admin |
| **PUT** | `/api/admin/settings/cod` | Configure COD handling fees & availability | Admin |
| **PUT** | `/api/admin/settings/payments` | Toggle prepaid and COD payment methods | Super Admin |
| **PUT** | `/api/admin/settings/storefront`| Update top announcement bar & contact info | Admin |
| **GET** | `/api/admin/customers` | Search & list customer accounts and lifetime spend | Admin |
| **PUT** | `/api/admin/customers/:id/toggle-block` | Restrict / unrestrict customer account | Admin |
| **GET** | `/api/admin/orders` | Filter, search & list all customer orders | Admin |
| **PUT** | `/api/admin/orders/:id/status` | Update fulfillment stage (PACKED, SHIPPED, etc.) | Order Manager |
| **GET** | `/api/admin/reports/orders/export` | Download full orders report as CSV | Admin |
| **GET** | `/api/admin/audit-logs` | Retrieve immutable admin action audit trail | Admin |

---

## 5. Workflows Implemented

### 5.1 Customer Authentication
1. Customer clicks "Sign In / Register" in header or is prompted at checkout.
2. Customer enters 10-digit Indian mobile number (`+91`).
3. Backend validates number, checks 60s resend cooldown, checks 10-minute rate limit, generates random 6-digit OTP, hashes with bcrypt, and sends via SMS provider (or dev test helper).
4. Customer enters 6-digit code.
5. Backend verifies code against stored hash, increments attempt counter, verifies 5-minute expiration window.
6. Upon success, customer user account is retrieved or created, and a 30-day HTTP-only session cookie is issued.
7. Any items in the guest cart are merged into the customer account, and the customer is redirected to their intended destination (e.g. `/checkout`).

### 5.2 Payment Workflow
- **Prepaid (Razorpay):**
  1. Cart and stock validated by backend.
  2. Backend computes final payable amount and creates pending order.
  3. Backend creates Razorpay order (`amount` in paise).
  4. Customer completes payment via UPI, Card, or Net Banking.
  5. Backend verifies HMAC SHA-256 signature (`order_id|payment_id`).
  6. Order marked `PAID` and `CONFIRMED`.
  7. Automated Surat dispatch shipment prepared.
- **Cash on Delivery (COD):**
  1. Backend checks if COD is enabled in admin settings, checks min/max order value limits, and validates PIN code.
  2. Backend adds configured COD handling fee (`₹50`).
  3. Order created with `orderStatus: CONFIRMED` and `paymentStatus: PENDING`.
  4. Shiprocket shipment initialized for doorstep collection.
  5. Upon delivery confirmation by courier, payment status transitions to `PAID`.

### 5.3 Shipping & Logistics Workflow
1. Dispatches originate from UNSULID's Surat fragrance facility (`UNSULID_SURAT`).
2. Shipments assigned express courier partner (`BlueDart Express Air`, `Delhivery`, `Xpressbees`).
3. Airway bill (AWB) number generated.
4. Logistics milestones recorded: Order Verified → Hand-Packed in Climate Vault → AWB Generated → Handed to Courier → In Transit → Delivered.
5. Customer can track live status directly from their account dashboard or public `/track-order` portal.

---

## 6. Admin Control Center Features

1. **Dashboard KPIs:** Real-time database metrics for total sales revenue, order volumes, fulfillment pipeline (Delivered vs Cancelled), prepaid vs COD share, bestseller product volumes, and low-stock alerts.
2. **Product Price & Stock Management:** Change selling prices, MRP, and inventory stock of HIGH CLASS and BLACK. Changes reflect immediately on the storefront.
3. **Offer & Coupon Engine:** Create percentage or flat discounts, enforce minimum order thresholds, set maximum discount caps, specify expiration dates, and monitor redemption counts.
4. **Shipping & COD Rules:** Adjust free shipping threshold (default `₹999`), modify standard delivery fees, configure COD handling fees (default `₹50`), or disable COD entirely.
5. **Fulfillment Desk:** Filter orders by status or payment method, search by order ID or customer phone number, advance fulfillment stages, and export CSV reports.
6. **Customer Relations:** Search customer mobile numbers, view lifetime order spend, and restrict/unrestrict accounts.
7. **Immutable Audit Trail:** Logs every price, shipping, coupon, and status modification with administrator identity, timestamp, and before/after diffs.

---

## 7. Automated Test Results

The comprehensive E2E test suite (`scripts/test-part5-e2e.ps1`) verified all 7 core functional areas:

```
========================================================
  RUNNING UNSULID® PART 5 MASTER TEST SUITE
========================================================

[GROUP 1] Product Catalog & Launch Availability
  ✅ PASS: GET /api/products returns success
  ✅ PASS: Catalog contains initial launch perfumes
  ✅ PASS: HIGH CLASS is purchasable at launch
  ✅ PASS: BLACK is purchasable at launch

[GROUP 2] Customer Mobile OTP Authentication
  ✅ PASS: OTP dispatched successfully
  ✅ PASS: Dev OTP generated for verification
  ✅ PASS: OTP cooldown enforced (Immediate resend rejected)
  ✅ PASS: Invalid OTP rejected
  ✅ PASS: Valid OTP verified
  ✅ PASS: Session token issued
  ✅ PASS: Profile retrieves authenticated user

[GROUP 3] Customer Delivery Addresses
  ✅ PASS: Customer can save delivery address
  ✅ PASS: Address listed in user account

[GROUP 4] Cart & Authoritative Backend Calculation
  ✅ PASS: Backend computes correct product price (HIGH CLASS = ₹1499)
  ✅ PASS: Complimentary shipping applied (Subtotal > ₹999 free threshold)

[GROUP 5] Coupon Code Validation & Application
  ✅ PASS: Coupon WELCOME10 is valid
  ✅ PASS: 10% discount accurately calculated (₹150 off)
  ✅ PASS: Invalid coupon code rejected

[GROUP 6] Orders Lifecycle & Payments
  ✅ PASS: COD Order created
  ✅ PASS: COD Order marked CONFIRMED
  ✅ PASS: COD Payment status is PENDING until delivery
  ✅ PASS: COD handling fee (₹50) accurately added to order
  ✅ PASS: Shiprocket AWB assigned for Surat warehouse dispatch
  ✅ PASS: Surat factory origin confirmed in tracking events
  ✅ PASS: Prepaid Order created
  ✅ PASS: Prepaid order starts in PAYMENT_PENDING status
  ✅ PASS: Razorpay gateway order initialized
  ✅ PASS: Razorpay payment verified
  ✅ PASS: Order marked CONFIRMED after payment verification
  ✅ PASS: Payment status updated to PAID

[GROUP 7] Advanced Admin Control Center
  ✅ PASS: Super Admin authenticated
  ✅ PASS: Admin dashboard reads real database orders
  ✅ PASS: Admin dashboard computes real revenue
  ✅ PASS: Admin updated HIGH CLASS selling price to ₹1599
  ✅ PASS: Customer storefront immediately reflects new price without code change
  ✅ PASS: Admin updated Free Shipping Threshold to ₹1200
  ✅ PASS: Admin updated COD handling fee to ₹75
  ✅ PASS: Historical order retains original COD fee (₹50) despite admin fee increase to ₹75
  ✅ PASS: Audit trail records all price, shipping, and COD updates

========================================================
  TEST RESULTS: 39 PASSED, 0 FAILED (100% SUCCESS)
========================================================
```

---

## 8. TypeScript & Production Build Verification

### Backend (`apps/api`):
```bash
cd apps/api
npm run build
# Result: Clean compilation via nest build in 5.8s, dist/ created with 0 errors
```

### Frontend (`apps/web`):
```bash
cd apps/web
npm run build
# Result: Next.js 14.2 optimized production build created in 28s
# All 25 static and dynamic pages generated with 0 errors
```

---

## 9. Environment Variables & Required External Accounts

Template created at `e:\unsulid\.env.example` and `apps/api/.env.example`:
- `DATABASE_URL`: PostgreSQL connection string (Neon pooled instance).
- `DIRECT_URL`: PostgreSQL non-pooled connection string for migrations.
- `SESSION_SECRET`: 64-byte random secret for session encryption.
- `JWT_SECRET`: Secret key for token signing.
- `OTP_PROVIDER`: `console` (dev/testing) or `msg91` / `twofactor` / `fast2sms` (production).
- `OTP_PROVIDER_API_KEY`: Production SMS provider API credentials.
- `RAZORPAY_KEY_ID`: Live/Test Razorpay merchant Key ID.
- `RAZORPAY_KEY_SECRET`: Live/Test Razorpay merchant Secret Key.
- `RAZORPAY_WEBHOOK_SECRET`: Secret configured in Razorpay Webhooks dashboard.
- `SHIPROCKET_EMAIL`: Registered Shiprocket account email.
- `SHIPROCKET_PASSWORD`: Shiprocket account password.
- `SHIPROCKET_PICKUP_LOCATION`: Surat warehouse pickup nickname (`UNSULID_SURAT`).
- `FRONTEND_URL`: URL of the Next.js storefront (`http://localhost:3001` or custom domain).
- `BACKEND_URL`: URL of the NestJS API server (`http://localhost:3000`).

### Default Initial Super Admin Credentials:
- **Email:** `admin@unsulid.com`
- **Password:** `Admin@Unsulid2026!`
- **Role:** `SUPER_ADMIN`

