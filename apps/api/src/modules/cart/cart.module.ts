import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { CouponsModule } from '@/modules/coupons/coupons.module';

@Module({
  imports: [AuthModule, CouponsModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

