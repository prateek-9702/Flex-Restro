import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    READY = "ready",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    tenant_id: string;
    restaurant_id: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    total_amount: number;
    status: OrderStatus;
    notes: string;
    items: OrderItem[];
    created_at: Date;
    updated_at: Date;
}
