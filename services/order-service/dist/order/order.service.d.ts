import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
export declare class OrderService {
    private orderRepository;
    private orderItemRepository;
    private rabbitmqService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, rabbitmqService: RabbitmqService);
    create(createOrderDto: any, tenantId: string): Promise<Order>;
    findAll(tenantId: string): Promise<Order[]>;
    findOne(id: string, tenantId: string): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<Order>;
    remove(id: string, tenantId: string): Promise<void>;
}
