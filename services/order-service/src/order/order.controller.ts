import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: { order: Partial<Order>; items: Partial<OrderItem>[] }, @Request() req): Promise<Order> {
    const tenantId = req.user.tenant_id;
    createOrderDto.order.tenant_id = tenantId;
    return this.orderService.create(createOrderDto.order, createOrderDto.items);
  }

  @Get()
  async findAll(@Request() req): Promise<Order[]> {
    const tenantId = req.user.tenant_id;
    return this.orderService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Order> {
    const tenantId = req.user.tenant_id;
    return this.orderService.findOne(id, tenantId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: { status: OrderStatus },
    @Request() req,
  ): Promise<Order> {
    const tenantId = req.user.tenant_id;
    return this.orderService.updateStatus(id, tenantId, updateStatusDto.status);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    const tenantId = req.user.tenant_id;
    return this.orderService.remove(id, tenantId);
  }
}
