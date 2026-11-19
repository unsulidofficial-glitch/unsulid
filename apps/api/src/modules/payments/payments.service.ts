import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DbStoreService } from '@/database/db-store.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpayClient: any = null;

  constructor(private readonly store: DbStoreService) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret && !keyId.includes('placeholder')) {
      try {
        const Razorpay = require('razorpay');
        this.razorpayClient = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });
        this.logger.log('💳 Razorpay client initialized with merchant credentials');
      } catch (e: any) {
        this.logger.warn(`Razorpay init note: ${e.message}`);
      }
    } else {
      this.logger.log('💳 Razorpay running in sandbox test mode with simulated gateway');
    }
  }

  async createRazorpayOrder(amountInRupees: number, receipt: string, notes: any = {}) {
    const amountInPaise = Math.round(amountInRupees * 100);

    if (this.razorpayClient) {
      try {
        const rzpOrder = await this.razorpayClient.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt,
          notes,
        });
        return {
          id: rzpOrder.id,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        };
      } catch (error: any) {
        this.logger.error(`Razorpay API Error: ${error.message}`);
        throw new BadRequestException(`Payment gateway error: ${error.message}`);
      }
    }

    // High-fidelity sandbox order generation when live keys are pending
    const simulatedOrderId = 'order_sim_' + crypto.randomBytes(12).toString('hex');
    return {
      id: simulatedOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_unsulid_demo',
      isSandbox: true,
    };
  }

  verifyRazorpaySignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    signature: string
  ): boolean {
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';

    // Allow sandbox simulated signature
    if (razorpayOrderId.startsWith('order_sim_') && signature.startsWith('sig_sim_')) {
      return true;
    }

    try {
      const generated = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      return generated === signature;
    } catch {
      return false;
    }
  }

  verifyWebhookSignature(body: string, receivedSignature: string): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
    try {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      return expected === receivedSignature;
    } catch {
      return false;
    }
  }
}

