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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ioredis_1 = require("ioredis");
const analytics_entity_1 = require("./analytics.entity");
let AnalyticsService = class AnalyticsService {
    constructor(analyticsRepository, cacheRepository) {
        this.analyticsRepository = analyticsRepository;
        this.cacheRepository = cacheRepository;
        if (process.env.NODE_ENV !== 'test') {
            this.redis = new ioredis_1.default({
                host: process.env.REDIS_HOST || 'localhost',
                port: parseInt(process.env.REDIS_PORT || '6379'),
                lazyConnect: true,
                maxRetriesPerRequest: 3,
                connectTimeout: 5000,
            });
        }
    }
    async getRevenueMetrics(tenantId, period = analytics_entity_1.PeriodType.MONTHLY) {
        const cacheKey = `revenue:${tenantId}:${period}`;
        const cached = await this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const metrics = await this.analyticsRepository.find({
            where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.REVENUE, period_type: period },
            order: { date: 'DESC' },
            take: 12,
        });
        const result = {
            total: metrics.reduce((sum, m) => sum + parseFloat(m.value_numeric?.toString() || '0'), 0),
            trend: metrics.map(m => ({ date: m.date, value: m.value_numeric })),
        };
        await this.setCachedData(cacheKey, result, 3600);
        return result;
    }
    async getOrderMetrics(tenantId, period = analytics_entity_1.PeriodType.MONTHLY) {
        const cacheKey = `orders:${tenantId}:${period}`;
        const cached = await this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const metrics = await this.analyticsRepository.find({
            where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.ORDERS, period_type: period },
            order: { date: 'DESC' },
            take: 12,
        });
        const result = {
            total: metrics.reduce((sum, m) => sum + parseInt(m.value_numeric?.toString() || '0'), 0),
            trend: metrics.map(m => ({ date: m.date, value: m.value_numeric })),
        };
        await this.setCachedData(cacheKey, result, 3600);
        return result;
    }
    async getTopSellingItems(tenantId) {
        const cacheKey = `top_items:${tenantId}`;
        const cached = await this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const metric = await this.analyticsRepository.findOne({
            where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.TOP_SELLING_ITEMS },
            order: { updated_at: 'DESC' },
        });
        const result = metric?.value_json || [];
        await this.setCachedData(cacheKey, result, 1800);
        return result;
    }
    async getAverageOrderValue(tenantId, period = analytics_entity_1.PeriodType.MONTHLY) {
        const cacheKey = `aov:${tenantId}:${period}`;
        const cached = await this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const metrics = await this.analyticsRepository.find({
            where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.AVERAGE_ORDER_VALUE, period_type: period },
            order: { date: 'DESC' },
            take: 12,
        });
        const result = {
            current: metrics[0]?.value_numeric || 0,
            trend: metrics.map(m => ({ date: m.date, value: m.value_numeric })),
        };
        await this.setCachedData(cacheKey, result, 3600);
        return result;
    }
    async getOrderStatusDistribution(tenantId) {
        const cacheKey = `order_status:${tenantId}`;
        const cached = await this.getCachedData(cacheKey);
        if (cached)
            return cached;
        const metric = await this.analyticsRepository.findOne({
            where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.ORDER_STATUS_DISTRIBUTION },
            order: { updated_at: 'DESC' },
        });
        const result = metric?.value_json || {};
        await this.setCachedData(cacheKey, result, 1800);
        return result;
    }
    async updateMetricsFromEvent(tenantId, eventType, data) {
        console.log(`Analytics event: ${eventType} for tenant ${tenantId}`, data);
    }
    async getCachedData(key) {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }
    async setCachedData(key, data, ttl) {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(data));
        }
        catch (error) {
            console.error('Redis set error:', error);
        }
    }
    async onModuleDestroy() {
        await this.redis.quit();
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(analytics_entity_1.AnalyticsMetric)),
    __param(1, (0, typeorm_1.InjectRepository)(analytics_entity_1.AnalyticsCache)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map