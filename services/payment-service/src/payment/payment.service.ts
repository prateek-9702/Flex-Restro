import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(orderId: string, amount: number, currency: string = 'usd', tenantId: string): Promise<Payment> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amount in cents
        currency,
        metadata: {
          order_id: orderId,
          tenant_id: tenantId,
        },
      });

      const payment = this.paymentRepository.create({
        tenant_id: tenantId,
        order_id: orderId,
        amount,
        currency,
        stripe_payment_intent_id: paymentIntent.id,
        status: PaymentStatus.PENDING,
      });

      return this.paymentRepository.save(payment);
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }

  async confirmPayment(paymentIntentId: string, tenantId: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { stripe_payment_intent_id: paymentIntentId, tenant_id: tenantId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
      });

      if (paymentIntent.status === 'succeeded') {
        payment.status = PaymentStatus.SUCCEEDED;
        payment.stripe_charge_id = (paymentIntent.latest_charge as Stripe.Charge)?.id;
      } else if (paymentIntent.status === 'requires_payment_method') {
        payment.status = PaymentStatus.FAILED;
        payment.failure_reason = 'Payment method required';
      } else {
        payment.status = PaymentStatus.FAILED;
        payment.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
      }

      return this.paymentRepository.save(payment);
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }

  async refundPayment(paymentId: string, tenantId: string, amount?: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id: paymentId, tenant_id: tenantId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new Error('Only succeeded payments can be refunded');
    }

    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.stripe_payment_intent_id,
        amount: amount ? Math.round(amount * 100) : undefined,
      });

      payment.status = PaymentStatus.REFUNDED;
      payment.metadata = { ...payment.metadata, refund_id: refund.id };

      return this.paymentRepository.save(payment);
    } catch (error) {
      throw new Error(`Failed to refund payment: ${error.message}`);
    }
  }

  async findAll(tenantId: string): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: { id, tenant_id: tenantId },
    });
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(paymentIntent.id, PaymentStatus.SUCCEEDED);
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.updatePaymentStatus(failedPaymentIntent.id, PaymentStatus.FAILED, failedPaymentIntent.last_payment_error?.message);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async updatePaymentStatus(paymentIntentId: string, status: PaymentStatus, failureReason?: string): Promise<void> {
    await this.paymentRepository.update(
      { stripe_payment_intent_id: paymentIntentId },
      { status, failure_reason: failureReason },
    );
  }
}
