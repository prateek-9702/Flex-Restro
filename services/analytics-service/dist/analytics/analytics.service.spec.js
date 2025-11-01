"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const analytics_service_1 = require("./analytics.service");
const analytics_entity_1 = require("./analytics.entity");
describe('AnalyticsService', () => {
    let service;
    let analyticsRepository;
    let cacheRepository;
    const mockAnalyticsRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    const mockCacheRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                analytics_service_1.AnalyticsService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(analytics_entity_1.AnalyticsMetric),
                    useValue: mockAnalyticsRepository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(analytics_entity_1.AnalyticsCache),
                    useValue: mockCacheRepository,
                },
            ],
        }).compile();
        service = module.get(analytics_service_1.AnalyticsService);
        analyticsRepository = module.get((0, typeorm_1.getRepositoryToken)(analytics_entity_1.AnalyticsMetric));
        cacheRepository = module.get((0, typeorm_1.getRepositoryToken)(analytics_entity_1.AnalyticsCache));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getRevenueMetrics', () => {
        it('should return revenue metrics', async () => {
            const tenantId = 'tenant-123';
            const mockMetrics = [
                {
                    id: 'metric-123',
                    tenant_id: tenantId,
                    metric_type: analytics_entity_1.MetricType.REVENUE,
                    period_type: analytics_entity_1.PeriodType.MONTHLY,
                    date: '2024-01-01',
                    value_numeric: 1000,
                    value_text: null,
                    value_json: null,
                    metadata: {},
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];
            mockAnalyticsRepository.find.mockResolvedValue(mockMetrics);
            const result = await service.getRevenueMetrics(tenantId);
            expect(result.total).toBe(1000);
            expect(result.trend).toHaveLength(1);
            expect(mockAnalyticsRepository.find).toHaveBeenCalledWith({
                where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.REVENUE, period_type: analytics_entity_1.PeriodType.MONTHLY },
                order: { date: 'DESC' },
                take: 12,
            });
        });
    });
    describe('getOrderMetrics', () => {
        it('should return order metrics', async () => {
            const tenantId = 'tenant-123';
            const mockMetrics = [
                {
                    id: 'metric-123',
                    tenant_id: tenantId,
                    metric_type: analytics_entity_1.MetricType.ORDERS,
                    period_type: analytics_entity_1.PeriodType.MONTHLY,
                    date: '2024-01-01',
                    value_numeric: 50,
                    value_text: null,
                    value_json: null,
                    metadata: {},
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ];
            mockAnalyticsRepository.find.mockResolvedValue(mockMetrics);
            const result = await service.getOrderMetrics(tenantId);
            expect(result.total).toBe(50);
            expect(result.trend).toHaveLength(1);
            expect(mockAnalyticsRepository.find).toHaveBeenCalledWith({
                where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.ORDERS, period_type: analytics_entity_1.PeriodType.MONTHLY },
                order: { date: 'DESC' },
                take: 12,
            });
        });
    });
    describe('getTopSellingItems', () => {
        it('should return top selling items', async () => {
            const tenantId = 'tenant-123';
            const mockData = [
                { item_id: 'item-1', name: 'Pizza', quantity: 100 },
                { item_id: 'item-2', name: 'Burger', quantity: 80 },
            ];
            const mockMetric = {
                id: 'metric-123',
                tenant_id: tenantId,
                metric_type: analytics_entity_1.MetricType.TOP_SELLING_ITEMS,
                period_type: analytics_entity_1.PeriodType.DAILY,
                date: '2024-01-01',
                value_numeric: null,
                value_text: null,
                value_json: mockData,
                metadata: {},
                created_at: new Date(),
                updated_at: new Date(),
            };
            mockAnalyticsRepository.findOne.mockResolvedValue(mockMetric);
            const result = await service.getTopSellingItems(tenantId);
            expect(result).toEqual(mockData);
            expect(mockAnalyticsRepository.findOne).toHaveBeenCalledWith({
                where: { tenant_id: tenantId, metric_type: analytics_entity_1.MetricType.TOP_SELLING_ITEMS },
                order: { updated_at: 'DESC' },
            });
        });
    });
    describe('updateMetricsFromEvent', () => {
        it('should handle event updates', async () => {
            const tenantId = 'tenant-123';
            const eventType = 'order_completed';
            const data = { orderId: 'order-123', amount: 100 };
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            await service.updateMetricsFromEvent(tenantId, eventType, data);
            expect(consoleSpy).toHaveBeenCalledWith(`Analytics event: ${eventType} for tenant ${tenantId}`, data);
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=analytics.service.spec.js.map