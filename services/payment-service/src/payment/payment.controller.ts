import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: { order_id: string; amount: number; currency?: string; tenant_id: string },
  ): Promise<Payment> {
    return this.paymentService.createPaymentIntent(
      createPaymentIntentDto.order_id,
      createPaymentIntentDto.amount,
      createPaymentIntentDto.currency,
      createPaymentIntentDto.tenant_id,
    );
  }

  @Post('confirm/:paymentIntentId')
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
    @Body('tenant_id') tenantId: string,
  ): Promise<Payment> {
    return this.paymentService.confirmPayment(paymentIntentId, tenantId);
  }

  @Post('webhook')
  async handleWebhook(@Body() event: any): Promise<{ received: boolean }> {
    await this.paymentService.handleWebhook(event);
    return { received: true };
  }

  @Post(':id/refund')
  async refundPayment(
    @Param('id') id: string,
    @Body() refundDto: { tenant_id: string; amount?: number },
  ): Promise<Payment> {
    return this.paymentService.refundPayment(id, refundDto.tenant_id, refundDto.amount);
  }

  @Get()
  async findAll(@Body('tenant_id') tenantId: string): Promise<Payment[]> {
    return this.paymentService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Body('tenant_id') tenantId: string): Promise<Payment> {
    return this.paymentService.findOne(id, tenantId);
  }
}
