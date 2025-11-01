import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { QRService } from './qr.service';
import { QRType } from './qr.entity';

@Controller('qr')
export class QRController {
  constructor(private readonly qrService: QRService) {}

  @Post('restaurant')
  async generateRestaurantQR(@Body() body: { restaurantId: string; tenantId: string }) {
    return this.qrService.generateRestaurantQR(body.restaurantId, body.tenantId);
  }

  @Post('table')
  async generateTableQR(@Body() body: { restaurantId: string; tenantId: string; tableNumber: number }) {
    return this.qrService.generateTableQR(body.restaurantId, body.tenantId, body.tableNumber);
  }

  @Post('order')
  async generateOrderQR(@Body() body: { orderId: string; restaurantId: string; tenantId: string }) {
    return this.qrService.generateOrderQR(body.orderId, body.restaurantId, body.tenantId);
  }

  @Get('restaurant/:restaurantId/:tenantId')
  async getRestaurantQRs(@Param('restaurantId') restaurantId: string, @Param('tenantId') tenantId: string) {
    return this.qrService.findByRestaurant(restaurantId, tenantId);
  }

  @Get(':shortUrl')
  async getQRData(@Param('shortUrl') shortUrl: string) {
    return this.qrService.getQRData(shortUrl);
  }

  @Post(':id/deactivate')
  async deactivateQR(@Param('id') id: string, @Body('tenantId') tenantId: string) {
    await this.qrService.deactivateQR(id, tenantId);
    return { message: 'QR code deactivated successfully' };
  }
}
