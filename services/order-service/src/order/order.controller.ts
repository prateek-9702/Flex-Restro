import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: { order: Partial<Order>; items: Partial<OrderItem>[] }): Promise<Order> {
    return this.orderService.create(createOrderDto.order, createOrderDto.items);
  }

  @Get()
  async findAll(@Body('tenant_id') tenantId: string): Promise<Order[]> {
    return this.orderService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('tenant_id') tenantId: string): Promise<Order> {
    return this.orderService.findOne(id, tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { tenant_id: string; status: OrderStatus },
  ): Promise<Order> {
    return this.orderService.updateStatus(id, updateStatusDto.tenant_id, updateStatusDto.status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('tenant_id') tenantId: string): Promise<void> {
    return this.orderService.remove(id, tenantId);
  }
}
