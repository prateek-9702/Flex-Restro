import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { AnalyticsMetric, AnalyticsCache, MetricType, PeriodType } from './analytics.entity';

@Injectable()
export class AnalyticsService {
  private redis: Redis;

  constructor(
    @InjectRepository(AnalyticsMetric)
    private analyticsRepository: Repository<AnalyticsMetric>,
    @InjectRepository(AnalyticsCache)
    private cacheRepository: Repository<AnalyticsCache>,
  ) {
    // Only connect to Redis if not in test environment
    if (process.env.NODE_ENV !== 'test') {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        lazyConnect: true, // Don't connect immediately
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
      });
    }
  }

  async getRevenueMetrics(tenantId: string, period: PeriodType = PeriodType.MONTHLY): Promise<any> {
    const cacheKey = `revenue:${tenantId}:${period}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    const metrics = await this.analyticsRepository.find({
      where: { tenant_id: tenantId, metric_type: MetricType.REVENUE, period_type: period },
      order: { date: 'DESC' },
      take: 12,
    });

    const result = {
      total: metrics.reduce((sum, m) => sum + parseFloat(m.value_numeric?.toString() || '0'), 0),
      trend: metrics.map(m => ({ date: m.date, value: m.value_numeric })),
    };

    await this.setCachedData(cacheKey, result, 3600); // Cache for 1 hour
    return result;
  }

  async getOrderMetrics(tenantId: string, period: PeriodType = PeriodType.MONTHLY): Promise<any> {
    const cacheKey = `orders:${tenantId}:${period}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    const metrics = await this.analyticsRepository.find({
      where: { tenant_id: tenantId, metric_type: MetricType.ORDERS, period_type: period },
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

  async getTopSellingItems(tenantId: string): Promise<any> {
    const cacheKey = `top_items:${tenantId}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    const metric = await this.analyticsRepository.findOne({
      where: { tenant_id: tenantId, metric_type: MetricType.TOP_SELLING_ITEMS },
      order: { updated_at: 'DESC' },
    });

    const result = metric?.value_json || [];
    await this.setCachedData(cacheKey, result, 1800); // Cache for 30 minutes
    return result;
  }

  async getAverageOrderValue(tenantId: string, period: PeriodType = PeriodType.MONTHLY): Promise<any> {
    const cacheKey = `aov:${tenantId}:${period}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    const metrics = await this.analyticsRepository.find({
      where: { tenant_id: tenantId, metric_type: MetricType.AVERAGE_ORDER_VALUE, period_type: period },
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

  async getOrderStatusDistribution(tenantId: string): Promise<any> {
    const cacheKey = `order_status:${tenantId}`;
    const cached = await this.getCachedData(cacheKey);
    if (cached) return cached;

    const metric = await this.analyticsRepository.findOne({
      where: { tenant_id: tenantId, metric_type: MetricType.ORDER_STATUS_DISTRIBUTION },
      order: { updated_at: 'DESC' },
    });

    const result = metric?.value_json || {};
    await this.setCachedData(cacheKey, result, 1800);
    return result;
  }

  async updateMetricsFromEvent(tenantId: string, eventType: string, data: any): Promise<void> {
    // This would be called by RabbitMQ event handlers
    // For now, just log the event
    console.log(`Analytics event: ${eventType} for tenant ${tenantId}`, data);

    // In a real implementation, this would update the metrics based on the event
    // For example, if it's an order completion event, update revenue and order counts
  }

  private async getCachedData(key: string): Promise<any> {
    try {
      const data = await this.redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  private async setCachedData(key: string, data: any, ttl: number): Promise<void> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(data));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }
}
