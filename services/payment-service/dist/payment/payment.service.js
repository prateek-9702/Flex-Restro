"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stripe_1 = require("stripe");
const payment_entity_1 = require("./payment.entity");
let PaymentService = class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(orderId, amount, currency = 'usd', tenantId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
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
                status: payment_entity_1.PaymentStatus.PENDING,
            });
            return this.paymentRepository.save(payment);
        }
        catch (error) {
            throw new Error(`Failed to create payment intent: ${error.message}`);
        }
    }
    async confirmPayment(paymentIntentId, tenantId) {
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
                payment.status = payment_entity_1.PaymentStatus.SUCCEEDED;
                payment.stripe_charge_id = paymentIntent.latest_charge?.id;
            }
            else if (paymentIntent.status === 'requires_payment_method') {
                payment.status = payment_entity_1.PaymentStatus.FAILED;
                payment.failure_reason = 'Payment method required';
            }
            else {
                payment.status = payment_entity_1.PaymentStatus.FAILED;
                payment.failure_reason = paymentIntent.last_payment_error?.message || 'Payment failed';
            }
            return this.paymentRepository.save(payment);
        }
        catch (error) {
            throw new Error(`Failed to confirm payment: ${error.message}`);
        }
    }
    async refundPayment(paymentId, tenantId, amount) {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId, tenant_id: tenantId },
        });
        if (!payment) {
            throw new Error('Payment not found');
        }
        if (payment.status !== payment_entity_1.PaymentStatus.SUCCEEDED) {
            throw new Error('Only succeeded payments can be refunded');
        }
        try {
            const refund = await this.stripe.refunds.create({
                payment_intent: payment.stripe_payment_intent_id,
                amount: amount ? Math.round(amount * 100) : undefined,
            });
            payment.status = payment_entity_1.PaymentStatus.REFUNDED;
            payment.metadata = { ...payment.metadata, refund_id: refund.id };
            return this.paymentRepository.save(payment);
        }
        catch (error) {
            throw new Error(`Failed to refund payment: ${error.message}`);
        }
    }
    async findAll(tenantId) {
        return this.paymentRepository.find({
            where: { tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id, tenantId) {
        return this.paymentRepository.findOne({
            where: { id, tenant_id: tenantId },
        });
    }
    async handleWebhook(event) {
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object;
                await this.updatePaymentStatus(paymentIntent.id, payment_entity_1.PaymentStatus.SUCCEEDED);
                break;
            case 'payment_intent.payment_failed':
                const failedPaymentIntent = event.data.object;
                await this.updatePaymentStatus(failedPaymentIntent.id, payment_entity_1.PaymentStatus.FAILED, failedPaymentIntent.last_payment_error?.message);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    }
    async updatePaymentStatus(paymentIntentId, status, failureReason) {
        await this.paymentRepository.update({ stripe_payment_intent_id: paymentIntentId }, { status, failure_reason: failureReason });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map