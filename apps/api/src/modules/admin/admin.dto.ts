import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  Min,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class AdminLoginDto {
  @IsEmail({}, { message: 'Valid admin email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class UpdateProductPriceDto {
  @IsNumber()
  @Min(0)
  sellingPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  mrp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMING_SOON', 'INACTIVE'])
  status?: 'ACTIVE' | 'COMING_SOON' | 'INACTIVE';
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber()
  @Min(1, { message: 'Selling price must be at least 1' })
  sellingPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  mrp?: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  @IsString()
  brandPersonality?: string;

  @IsOptional()
  @IsString()
  bottleSize?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsEnum(['ACTIVE', 'COMING_SOON', 'INACTIVE'])
  status?: 'ACTIVE' | 'COMING_SOON' | 'INACTIVE';

  @IsOptional()
  @IsArray()
  images?: { url: string; altText?: string; isPrimary?: boolean }[];

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['PERCENTAGE', 'FIXED'])
  discountType: 'PERCENTAGE' | 'FIXED';

  @IsNumber()
  @Min(1)
  discountValue: number;

  @IsNumber()
  @Min(0)
  minOrderValue: number;

  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @IsOptional()
  @IsNumber()
  usageLimit?: number;

  @IsOptional()
  @IsNumber()
  perUserLimit?: number;

  @IsString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCouponDto extends CreateCouponDto {}

export class UpdateShippingSettingsDto {
  @IsNumber()
  @Min(0)
  freeShippingThreshold: number;

  @IsNumber()
  @Min(0)
  standardShippingFee: number;
}

export class UpdateCodSettingsDto {
  @IsBoolean()
  codEnabled: boolean;

  @IsNumber()
  @Min(0)
  codHandlingFee: number;

  @IsNumber()
  @Min(0)
  minCodOrderValue: number;

  @IsNumber()
  @Min(0)
  maxCodOrderValue: number;

  @IsOptional()
  @IsArray()
  restrictedPinCodes?: string[];
}

export class UpdatePaymentSettingsDto {
  @IsBoolean()
  prepaidEnabled: boolean;

  @IsBoolean()
  codEnabled: boolean;
}

export class UpdateStorefrontSettingsDto {
  @IsString()
  @IsNotEmpty()
  announcementBarMessage: string;

  @IsOptional()
  @IsString()
  storePhone?: string;

  @IsOptional()
  @IsEmail()
  storeEmail?: string;
}

export class UpdateOrderStatusDto {
  @IsEnum([
    'PENDING',
    'PAYMENT_PENDING',
    'CONFIRMED',
    'PROCESSING',
    'PACKED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
    'REFUND_INITIATED',
    'REFUNDED',
    'FAILED',
  ])
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

  @IsOptional()
  @IsString()
  trackingAwb?: string;

  @IsOptional()
  @IsString()
  courierName?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

