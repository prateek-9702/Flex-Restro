import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsMetric, AnalyticsCache, MetricType, PeriodType } from './analytics.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let analyticsRepository: Repository<AnalyticsMetric>;
  let cacheRepository: Repository<AnalyticsCache>;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(AnalyticsMetric),
          useValue: mockAnalyticsRepository,
        },
        {
          provide: getRepositoryToken(AnalyticsCache),
          useValue: mockCacheRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    analyticsRepository = module.get<Repository<AnalyticsMetric>>(getRepositoryToken(AnalyticsMetric));
    cacheRepository = module.get<Repository<AnalyticsCache>>(getRepositoryToken(AnalyticsCache));
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
          metric_type: MetricType.REVENUE,
          period_type: PeriodType.MONTHLY,
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
        where: { tenant_id: tenantId, metric_type: MetricType.REVENUE, period_type: PeriodType.MONTHLY },
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
          metric_type: MetricType.ORDERS,
          period_type: PeriodType.MONTHLY,
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
        where: { tenant_id: tenantId, metric_type: MetricType.ORDERS, period_type: PeriodType.MONTHLY },
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
        metric_type: MetricType.TOP_SELLING_ITEMS,
        period_type: PeriodType.DAILY,
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
        where: { tenant_id: tenantId, metric_type: MetricType.TOP_SELLING_ITEMS },
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

      expect(consoleSpy).toHaveBeenCalledWith(
        `Analytics event: ${eventType} for tenant ${tenantId}`,
        data
      );

      consoleSpy.mockRestore();
    });
  });
});
