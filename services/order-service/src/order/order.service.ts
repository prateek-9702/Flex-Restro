import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private rabbitmqService: RabbitmqService,
  ) {}

  async create(createOrderDto: any, tenantId: string): Promise<Order> {
    const { items, ...orderData } = createOrderDto;

    const order = this.orderRepository.create({
      ...orderData,
      tenant_id: tenantId,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
        special_instructions: item.special_instructions,
        order: savedOrder,
      }));
      await this.orderItemRepository.save(orderItems);
      (savedOrder as any).items = orderItems;
    }

    // Publish order created event
    await this.rabbitmqService.publishOrderCreated(savedOrder);

    return savedOrder as unknown as Order;
  }

  async findAll(tenantId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { tenant_id: tenantId },
      relations: ['items'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string, tenantId: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id, tenant_id: tenantId },
      relations: ['items'],
    });
  }

  async updateStatus(id: string, status: OrderStatus, tenantId: string): Promise<Order> {
    const order = await this.findOne(id, tenantId);
    if (!order) {
      throw new Error('Order not found');
    }

    const oldStatus = order.status;
    order.status = status;
    order.updated_at = new Date();

    const updatedOrder = await this.orderRepository.save(order);

    // Publish order status updated event
    await this.rabbitmqService.publishOrderStatusUpdated(updatedOrder, oldStatus);

    return updatedOrder;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const order = await this.findOne(id, tenantId);
    if (!order) {
      throw new Error('Order not found');
    }

    // If cancelling an order, publish cancellation event
    if (order.status !== OrderStatus.CANCELLED) {
      order.status = OrderStatus.CANCELLED;
      order.updated_at = new Date();
      await this.orderRepository.save(order);
      await this.rabbitmqService.publishOrderCancelled(order);
    }

    await this.orderRepository.delete({ id, tenant_id: tenantId });
  }
}
