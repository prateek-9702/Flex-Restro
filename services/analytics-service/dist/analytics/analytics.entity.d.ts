export declare enum MetricType {
    REVENUE = "revenue",
    ORDERS = "orders",
    CUSTOMERS = "customers",
    ITEMS_SOLD = "items_sold",
    AVERAGE_ORDER_VALUE = "average_order_value",
    TOP_SELLING_ITEMS = "top_selling_items",
    REVENUE_BY_PERIOD = "revenue_by_period",
    ORDER_STATUS_DISTRIBUTION = "order_status_distribution"
}
export declare enum PeriodType {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare class AnalyticsMetric {
    id: string;
    tenant_id: string;
    metric_type: MetricType;
    period_type: PeriodType;
    date: string;
    value_numeric: number;
    value_text: string;
    value_json: any;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
export declare class AnalyticsCache {
    id: string;
    tenant_id: string;
    cache_key: string;
    cache_value: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}
