import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { ShippingModule } from '@/modules/shipping/shipping.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [ShippingModule, AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

