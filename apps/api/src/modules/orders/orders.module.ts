import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '@/modules/cart/cart.module';
import { UsersModule } from '@/modules/users/users.module';
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ShippingModule } from '@/modules/shipping/shipping.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [CartModule, UsersModule, PaymentsModule, ShippingModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

