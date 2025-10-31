import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum MetricType {
  REVENUE = 'revenue',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  ITEMS_SOLD = 'items_sold',
  AVERAGE_ORDER_VALUE = 'average_order_value',
  TOP_SELLING_ITEMS = 'top_selling_items',
  REVENUE_BY_PERIOD = 'revenue_by_period',
  ORDER_STATUS_DISTRIBUTION = 'order_status_distribution',
}

export enum PeriodType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity()
export class AnalyticsMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column({
    type: 'enum',
    enum: MetricType,
  })
  metric_type: MetricType;

  @Column({
    type: 'enum',
    enum: PeriodType,
    default: PeriodType.DAILY,
  })
  period_type: PeriodType;

  @Column('date')
  date: string;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  value_numeric: number;

  @Column('text', { nullable: true })
  value_text: string;

  @Column('json', { nullable: true })
  value_json: any;

  @Column('json', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

@Entity()
export class AnalyticsCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @Column()
  cache_key: string;

  @Column('text')
  cache_value: string;

  @Column('timestamp')
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
