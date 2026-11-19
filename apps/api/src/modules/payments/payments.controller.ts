import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  Logger,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { DbStoreService } from '@/database/db-store.service';
import { ShiprocketService } from '@/modules/shipping/shiprocket.service';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly store: DbStoreService,
    private readonly shiprocketService: ShiprocketService
  ) {}

  @Post('razorpay/verify')
  @UseGuards(AuthGuard)
  async verifyPayment(@Req() req: any, @Body() dto: VerifyPaymentDto) {
    const order = this.store.orders.find(
      (o) => o.id === dto.orderId || o.orderNumber === dto.orderId
    );
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.userId !== req.user.id) {
      throw new BadRequestException('Unauthorized order payment verification');
    }

    // Verify signature
    const isValid = this.paymentsService.verifyRazorpaySignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature
    );

    if (!isValid) {
      order.paymentStatus = 'FAILED';
      this.logger.error(`❌ Payment verification signature failed for order ${order.orderNumber}`);
      throw new BadRequestException('Invalid Razorpay signature. Verification failed.');
    }

    // Update order status
    order.paymentStatus = 'PAID';
    order.orderStatus = 'CONFIRMED';
    order.razorpayPaymentId = dto.razorpayPaymentId;
    order.updatedAt = new Date();

    // Prepare Surat factory dispatch shipment
    if (!order.shipment) {
      const shipment = await this.shiprocketService.createShipmentForOrder(order);
      order.shipment = shipment;
    }

    this.logger.log(
      `✅ Razorpay payment confirmed for order ${order.orderNumber} (Payment ID: ${dto.razorpayPaymentId})`
    );

    return {
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        grandTotal: order.grandTotal,
      },
    };
  }

  @Post('razorpay/webhook')
  async handleRazorpayWebhook(
    @Body() payload: any,
    @Headers('x-razorpay-signature') signature: string
  ) {
    this.logger.log(`Received Razorpay webhook event: ${payload?.event}`);

    // Verify webhook signature if present
    const rawString = JSON.stringify(payload);
    if (signature && !this.paymentsService.verifyWebhookSignature(rawString, signature)) {
      this.logger.warn('⚠️ Webhook signature mismatch');
    }

    const event = payload?.event;
    if (event === 'payment.captured') {
      const paymentEntity = payload?.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const rzpPaymentId = paymentEntity?.id;

      if (rzpOrderId) {
        const order = this.store.orders.find((o) => o.razorpayOrderId === rzpOrderId);
        if (order) {
          // Idempotency: skip if already marked as PAID
          if (order.paymentStatus === 'PAID') {
            this.logger.log(`Idempotent webhook: order ${order.orderNumber} already marked PAID`);
            return { status: 'ok', message: 'Already processed' };
          }

          order.paymentStatus = 'PAID';
          order.orderStatus = 'CONFIRMED';
          order.razorpayPaymentId = rzpPaymentId;
          order.updatedAt = new Date();

          if (!order.shipment) {
            order.shipment = await this.shiprocketService.createShipmentForOrder(order);
          }
        }
      }
    }

    return { status: 'ok' };
  }
}

