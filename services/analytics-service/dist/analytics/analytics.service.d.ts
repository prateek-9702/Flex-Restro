import { Repository } from 'typeorm';
import { AnalyticsMetric, AnalyticsCache, PeriodType } from './analytics.entity';
export declare class AnalyticsService {
    private analyticsRepository;
    private cacheRepository;
    private redis;
    constructor(analyticsRepository: Repository<AnalyticsMetric>, cacheRepository: Repository<AnalyticsCache>);
    getRevenueMetrics(tenantId: string, period?: PeriodType): Promise<any>;
    getOrderMetrics(tenantId: string, period?: PeriodType): Promise<any>;
    getTopSellingItems(tenantId: string): Promise<any>;
    getAverageOrderValue(tenantId: string, period?: PeriodType): Promise<any>;
    getOrderStatusDistribution(tenantId: string): Promise<any>;
    updateMetricsFromEvent(tenantId: string, eventType: string, data: any): Promise<void>;
    private getCachedData;
    private setCachedData;
    onModuleDestroy(): Promise<void>;
}
