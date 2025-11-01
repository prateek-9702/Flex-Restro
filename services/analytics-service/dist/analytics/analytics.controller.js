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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const analytics_entity_1 = require("./analytics.entity");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getRevenue(tenantId, period) {
        return this.analyticsService.getRevenueMetrics(tenantId, period);
    }
    async getOrders(tenantId, period) {
        return this.analyticsService.getOrderMetrics(tenantId, period);
    }
    async getTopSellingItems(tenantId) {
        return this.analyticsService.getTopSellingItems(tenantId);
    }
    async getAverageOrderValue(tenantId, period) {
        return this.analyticsService.getAverageOrderValue(tenantId, period);
    }
    async getOrderStatusDistribution(tenantId) {
        return this.analyticsService.getOrderStatusDistribution(tenantId);
    }
    async getDashboard(tenantId) {
        const [revenue, orders, topItems, aov, statusDist] = await Promise.all([
            this.analyticsService.getRevenueMetrics(tenantId),
            this.analyticsService.getOrderMetrics(tenantId),
            this.analyticsService.getTopSellingItems(tenantId),
            this.analyticsService.getAverageOrderValue(tenantId),
            this.analyticsService.getOrderStatusDistribution(tenantId),
        ]);
        return {
            revenue,
            orders,
            topSellingItems: topItems,
            averageOrderValue: aov,
            orderStatusDistribution: statusDist,
        };
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('revenue/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('orders/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Get)('top-items/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopSellingItems", null);
__decorate([
    (0, common_1.Get)('average-order-value/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getAverageOrderValue", null);
__decorate([
    (0, common_1.Get)('order-status/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOrderStatusDistribution", null);
__decorate([
    (0, common_1.Get)('dashboard/:tenantId'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map