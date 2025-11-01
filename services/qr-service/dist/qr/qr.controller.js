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
exports.QRController = void 0;
const common_1 = require("@nestjs/common");
const qr_service_1 = require("./qr.service");
let QRController = class QRController {
    constructor(qrService) {
        this.qrService = qrService;
    }
    async generateRestaurantQR(body) {
        return this.qrService.generateRestaurantQR(body.restaurantId, body.tenantId);
    }
    async generateTableQR(body) {
        return this.qrService.generateTableQR(body.restaurantId, body.tenantId, body.tableNumber);
    }
    async generateOrderQR(body) {
        return this.qrService.generateOrderQR(body.orderId, body.restaurantId, body.tenantId);
    }
    async getRestaurantQRs(restaurantId, tenantId) {
        return this.qrService.findByRestaurant(restaurantId, tenantId);
    }
    async getQRData(shortUrl) {
        return this.qrService.getQRData(shortUrl);
    }
    async deactivateQR(id, tenantId) {
        await this.qrService.deactivateQR(id, tenantId);
        return { message: 'QR code deactivated successfully' };
    }
};
exports.QRController = QRController;
__decorate([
    (0, common_1.Post)('restaurant'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "generateRestaurantQR", null);
__decorate([
    (0, common_1.Post)('table'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "generateTableQR", null);
__decorate([
    (0, common_1.Post)('order'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "generateOrderQR", null);
__decorate([
    (0, common_1.Get)('restaurant/:restaurantId/:tenantId'),
    __param(0, (0, common_1.Param)('restaurantId')),
    __param(1, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "getRestaurantQRs", null);
__decorate([
    (0, common_1.Get)(':shortUrl'),
    __param(0, (0, common_1.Param)('shortUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "getQRData", null);
__decorate([
    (0, common_1.Post)(':id/deactivate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], QRController.prototype, "deactivateQR", null);
exports.QRController = QRController = __decorate([
    (0, common_1.Controller)('qr'),
    __metadata("design:paramtypes", [qr_service_1.QRService])
], QRController);
//# sourceMappingURL=qr.controller.js.map