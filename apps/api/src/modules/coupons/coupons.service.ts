import { Injectable, BadRequestException } from '@nestjs/common';
import { DbStoreService, CouponRecord } from '@/database/db-store.service';

@Injectable()
export class CouponsService {
  constructor(private readonly store: DbStoreService) {}

  async validateAndCalculateDiscount(code: string, subtotal: number, userId?: string) {
    if (!code || !code.trim()) {
      return { isValid: false, discount: 0, message: 'No coupon code provided' };
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = this.store.coupons.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );

    if (!coupon) {
      throw new BadRequestException('Invalid or inactive coupon code');
    }

    const now = new Date();
    if (coupon.startDate > now || coupon.endDate < now) {
      throw new BadRequestException('This coupon code has expired');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new BadRequestException('This coupon code has reached its maximum usage limit');
    }

    if (subtotal < coupon.minOrderValue) {
      throw new BadRequestException(
        `This coupon requires a minimum cart subtotal of ₹${coupon.minOrderValue}`
      );
    }

    // Check per-user limit if userId provided
    if (userId) {
      const userUsages = this.store.orders.filter(
        (o) => o.userId === userId && o.couponCode === coupon.code && o.orderStatus !== 'CANCELLED'
      ).length;
      if (userUsages >= coupon.perUserLimit) {
        throw new BadRequestException('You have already used this promo code');
      }
    }

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, subtotal);
    }

    return {
      isValid: true,
      code: coupon.code,
      name: coupon.name,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount,
      message: `Coupon '${coupon.code}' applied: ₹${discount} savings!`,
    };
  }

  async recordUsage(code: string) {
    const coupon = this.store.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      coupon.usedCount += 1;
    }
  }
}

