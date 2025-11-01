import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment } from './payment.entity';
export declare class PaymentService {
    private paymentRepository;
    private stripe;
    constructor(paymentRepository: Repository<Payment>);
    createPaymentIntent(orderId: string, amount: number, currency: string, tenantId: string): Promise<Payment>;
    confirmPayment(paymentIntentId: string, tenantId: string): Promise<Payment>;
    refundPayment(paymentId: string, tenantId: string, amount?: number): Promise<Payment>;
    findAll(tenantId: string): Promise<Payment[]>;
    findOne(id: string, tenantId: string): Promise<Payment>;
    handleWebhook(event: Stripe.Event): Promise<void>;
    private updatePaymentStatus;
}
