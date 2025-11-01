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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async createPaymentIntent(createPaymentIntentDto, req) {
        const tenantId = req.user.tenant_id;
        return this.paymentService.createPaymentIntent(createPaymentIntentDto.order_id, createPaymentIntentDto.amount, createPaymentIntentDto.currency, tenantId);
    }
    async confirmPayment(paymentIntentId, req) {
        const tenantId = req.user.tenant_id;
        return this.paymentService.confirmPayment(paymentIntentId, tenantId);
    }
    async handleWebhook(event) {
        await this.paymentService.handleWebhook(event);
        return { received: true };
    }
    async refundPayment(id, refundDto, req) {
        const tenantId = req.user.tenant_id;
        return this.paymentService.refundPayment(id, tenantId, refundDto.amount);
    }
    async findAll(req) {
        const tenantId = req.user.tenant_id;
        return this.paymentService.findAll(tenantId);
    }
    async findOne(id, req) {
        const tenantId = req.user.tenant_id;
        return this.paymentService.findOne(id, tenantId);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('create-intent'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "createPaymentIntent", null);
__decorate([
    (0, common_1.Post)('confirm/:paymentIntentId'),
    __param(0, (0, common_1.Param)('paymentIntentId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map