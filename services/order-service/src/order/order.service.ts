import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(orderData: Partial<Order>, items: Partial<OrderItem>[]): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    const savedOrder = await this.orderRepository.save(order);

    const orderItems = items.map(item => ({
      ...item,
      order: savedOrder,
    }));
    await this.orderItemRepository.save(orderItems);

    return this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });
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

  async updateStatus(id: string, tenantId: string, status: OrderStatus): Promise<Order> {
    await this.orderRepository.update({ id, tenant_id: tenantId }, { status });
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.orderRepository.delete({ id, tenant_id: tenantId });
  }
}
