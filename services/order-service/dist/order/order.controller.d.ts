import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(createOrderDto: {
        order: Partial<Order>;
        items: Partial<OrderItem>[];
    }): Promise<Order>;
    findAll(tenantId: string): Promise<Order[]>;
    findOne(id: string, tenantId: string): Promise<Order>;
    updateStatus(id: string, updateStatusDto: {
        tenant_id: string;
        status: OrderStatus;
    }): Promise<Order>;
    remove(id: string, tenantId: string): Promise<void>;
}
