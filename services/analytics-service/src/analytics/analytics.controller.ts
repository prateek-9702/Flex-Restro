import { Controller, Get, Query, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { PeriodType } from './analytics.entity';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('revenue/:tenantId')
  async getRevenue(@Param('tenantId') tenantId: string, @Query('period') period: PeriodType) {
    return this.analyticsService.getRevenueMetrics(tenantId, period);
  }

  @Get('orders/:tenantId')
  async getOrders(@Param('tenantId') tenantId: string, @Query('period') period: PeriodType) {
    return this.analyticsService.getOrderMetrics(tenantId, period);
  }

  @Get('top-items/:tenantId')
  async getTopSellingItems(@Param('tenantId') tenantId: string) {
    return this.analyticsService.getTopSellingItems(tenantId);
  }

  @Get('average-order-value/:tenantId')
  async getAverageOrderValue(@Param('tenantId') tenantId: string, @Query('period') period: PeriodType) {
    return this.analyticsService.getAverageOrderValue(tenantId, period);
  }

  @Get('order-status/:tenantId')
  async getOrderStatusDistribution(@Param('tenantId') tenantId: string) {
    return this.analyticsService.getOrderStatusDistribution(tenantId);
  }

  @Get('dashboard/:tenantId')
  async getDashboard(@Param('tenantId') tenantId: string) {
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
}
