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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsCache = exports.AnalyticsMetric = exports.PeriodType = exports.MetricType = void 0;
const typeorm_1 = require("typeorm");
var MetricType;
(function (MetricType) {
    MetricType["REVENUE"] = "revenue";
    MetricType["ORDERS"] = "orders";
    MetricType["CUSTOMERS"] = "customers";
    MetricType["ITEMS_SOLD"] = "items_sold";
    MetricType["AVERAGE_ORDER_VALUE"] = "average_order_value";
    MetricType["TOP_SELLING_ITEMS"] = "top_selling_items";
    MetricType["REVENUE_BY_PERIOD"] = "revenue_by_period";
    MetricType["ORDER_STATUS_DISTRIBUTION"] = "order_status_distribution";
})(MetricType || (exports.MetricType = MetricType = {}));
var PeriodType;
(function (PeriodType) {
    PeriodType["DAILY"] = "daily";
    PeriodType["WEEKLY"] = "weekly";
    PeriodType["MONTHLY"] = "monthly";
    PeriodType["YEARLY"] = "yearly";
})(PeriodType || (exports.PeriodType = PeriodType = {}));
let AnalyticsMetric = class AnalyticsMetric {
};
exports.AnalyticsMetric = AnalyticsMetric;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetricType,
    }),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "metric_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PeriodType,
        default: PeriodType.DAILY,
    }),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "period_type", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AnalyticsMetric.prototype, "value_numeric", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], AnalyticsMetric.prototype, "value_text", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], AnalyticsMetric.prototype, "value_json", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], AnalyticsMetric.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsMetric.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsMetric.prototype, "updated_at", void 0);
exports.AnalyticsMetric = AnalyticsMetric = __decorate([
    (0, typeorm_1.Entity)()
], AnalyticsMetric);
let AnalyticsCache = class AnalyticsCache {
};
exports.AnalyticsCache = AnalyticsCache;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AnalyticsCache.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnalyticsCache.prototype, "tenant_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnalyticsCache.prototype, "cache_key", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], AnalyticsCache.prototype, "cache_value", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], AnalyticsCache.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsCache.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AnalyticsCache.prototype, "updated_at", void 0);
exports.AnalyticsCache = AnalyticsCache = __decorate([
    (0, typeorm_1.Entity)()
], AnalyticsCache);
//# sourceMappingURL=analytics.entity.js.map