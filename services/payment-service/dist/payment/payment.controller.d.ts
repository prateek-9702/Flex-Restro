import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPaymentIntent(createPaymentIntentDto: {
        order_id: string;
        amount: number;
        currency?: string;
    }, req: any): Promise<Payment>;
    confirmPayment(paymentIntentId: string, req: any): Promise<Payment>;
    handleWebhook(event: any): Promise<{
        received: boolean;
    }>;
    refundPayment(id: string, refundDto: {
        amount?: number;
    }, req: any): Promise<Payment>;
    findAll(req: any): Promise<Payment[]>;
    findOne(id: string, req: any): Promise<Payment>;
}
