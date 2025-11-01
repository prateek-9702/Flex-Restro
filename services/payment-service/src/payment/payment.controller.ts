import { Controller, Get, Post, Body, Param, Patch, Request, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  async createPaymentIntent(
    @Body() createPaymentIntentDto: { order_id: string; amount: number; currency?: string },
    @Request() req,
  ): Promise<Payment> {
    const tenantId = req.user.tenant_id;
    return this.paymentService.createPaymentIntent(
      createPaymentIntentDto.order_id,
      createPaymentIntentDto.amount,
      createPaymentIntentDto.currency,
      tenantId,
    );
  }

  @Post('confirm/:paymentIntentId')
  async confirmPayment(
    @Param('paymentIntentId') paymentIntentId: string,
    @Request() req,
  ): Promise<Payment> {
    const tenantId = req.user.tenant_id;
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
    @Body() refundDto: { amount?: number },
    @Request() req,
  ): Promise<Payment> {
    const tenantId = req.user.tenant_id;
    return this.paymentService.refundPayment(id, tenantId, refundDto.amount);
  }

  @Get()
  async findAll(@Request() req): Promise<Payment[]> {
    const tenantId = req.user.tenant_id;
    return this.paymentService.findAll(tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req): Promise<Payment> {
    const tenantId = req.user.tenant_id;
    return this.paymentService.findOne(id, tenantId);
  }
}
