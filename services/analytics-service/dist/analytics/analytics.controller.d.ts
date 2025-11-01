import { AnalyticsService } from './analytics.service';
import { PeriodType } from './analytics.entity';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getRevenue(tenantId: string, period: PeriodType): Promise<any>;
    getOrders(tenantId: string, period: PeriodType): Promise<any>;
    getTopSellingItems(tenantId: string): Promise<any>;
    getAverageOrderValue(tenantId: string, period: PeriodType): Promise<any>;
    getOrderStatusDistribution(tenantId: string): Promise<any>;
    getDashboard(tenantId: string): Promise<{
        revenue: any;
        orders: any;
        topSellingItems: any;
        averageOrderValue: any;
        orderStatusDistribution: any;
    }>;
}
