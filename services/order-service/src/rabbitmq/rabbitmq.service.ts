import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitmqService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
  ) {}

  async publishOrderEvent(eventType: string, data: any): Promise<void> {
    try {
      await this.client.emit(eventType, data).toPromise();
      console.log(`Published order event: ${eventType}`, data);
    } catch (error) {
      console.error(`Failed to publish order event: ${eventType}`, error);
    }
  }

  async publishOrderCreated(order: any): Promise<void> {
    await this.publishOrderEvent('order.created', {
      orderId: order.id,
      tenantId: order.tenant_id,
      totalAmount: order.total_amount,
      status: order.status,
      items: order.orderItems?.map(item => ({
        menuItemId: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      })),
      createdAt: order.created_at,
    });
  }

  async publishOrderStatusUpdated(order: any, oldStatus: string): Promise<void> {
    await this.publishOrderEvent('order.status.updated', {
      orderId: order.id,
      tenantId: order.tenant_id,
      oldStatus,
      newStatus: order.status,
      updatedAt: order.updated_at,
    });
  }

  async publishOrderCancelled(order: any): Promise<void> {
    await this.publishOrderEvent('order.cancelled', {
      orderId: order.id,
      tenantId: order.tenant_id,
      reason: order.cancellation_reason,
      cancelledAt: order.updated_at,
    });
  }
}
