import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { OptionalAuthGuard } from '@/modules/auth/auth.guard';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ApplyCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  subtotal: number;
}

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('apply')
  @UseGuards(OptionalAuthGuard)
  async applyCoupon(@Body() dto: ApplyCouponDto, @Req() req: any) {
    const result = await this.couponsService.validateAndCalculateDiscount(
      dto.code,
      dto.subtotal,
      req.user?.id
    );
    return { success: true, ...result };
  }
}

