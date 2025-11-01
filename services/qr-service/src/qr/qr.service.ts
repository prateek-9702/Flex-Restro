import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import * as shortid from 'shortid';
import { S3 } from 'aws-sdk';
import { QR, QRType } from './qr.entity';

@Injectable()
export class QRService {
  private s3: S3;

  constructor(
    @InjectRepository(QR)
    private qrRepository: Repository<QR>,
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async generateRestaurantQR(restaurantId: string, tenantId: string): Promise<QR> {
    const data = {
      type: QRType.RESTAURANT,
      restaurantId,
      tenantId,
    };

    const qrDataString = JSON.stringify(data);
    const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
    const shortUrl = shortid.generate();

    // Upload QR code to S3
    const s3Key = `qr-codes/restaurant-${restaurantId}-${Date.now()}.png`;
    await this.s3.upload({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: qrCodeBuffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    }).promise();

    const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const qr = this.qrRepository.create({
      tenant_id: tenantId,
      restaurant_id: restaurantId,
      type: QRType.RESTAURANT,
      short_url: shortUrl,
      qr_code_url: qrCodeUrl,
      data: qrDataString,
    });

    return this.qrRepository.save(qr);
  }

  async generateTableQR(restaurantId: string, tenantId: string, tableNumber: number): Promise<QR> {
    const data = {
      type: QRType.TABLE,
      restaurantId,
      tenantId,
      tableNumber,
    };

    const qrDataString = JSON.stringify(data);
    const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
    const shortUrl = shortid.generate();

    // Upload QR code to S3
    const s3Key = `qr-codes/table-${restaurantId}-${tableNumber}-${Date.now()}.png`;
    await this.s3.upload({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: qrCodeBuffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    }).promise();

    const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const qr = this.qrRepository.create({
      tenant_id: tenantId,
      restaurant_id: restaurantId,
      type: QRType.TABLE,
      table_number: tableNumber,
      short_url: shortUrl,
      qr_code_url: qrCodeUrl,
      data: qrDataString,
    });

    return this.qrRepository.save(qr);
  }

  async generateOrderQR(orderId: string, restaurantId: string, tenantId: string): Promise<QR> {
    const data = {
      type: QRType.ORDER,
      orderId,
      restaurantId,
      tenantId,
    };

    const qrDataString = JSON.stringify(data);
    const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
    const shortUrl = shortid.generate();

    // Upload QR code to S3
    const s3Key = `qr-codes/order-${orderId}-${Date.now()}.png`;
    await this.s3.upload({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
      Body: qrCodeBuffer,
      ContentType: 'image/png',
      ACL: 'public-read',
    }).promise();

    const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

    const qr = this.qrRepository.create({
      tenant_id: tenantId,
      restaurant_id: restaurantId,
      type: QRType.ORDER,
      order_id: orderId,
      short_url: shortUrl,
      qr_code_url: qrCodeUrl,
      data: qrDataString,
    });

    return this.qrRepository.save(qr);
  }

  async findByShortUrl(shortUrl: string): Promise<QR | null> {
    return this.qrRepository.findOne({ where: { short_url: shortUrl, is_active: true } });
  }

  async findByRestaurant(restaurantId: string, tenantId: string): Promise<QR[]> {
    return this.qrRepository.find({
      where: { restaurant_id: restaurantId, tenant_id: tenantId },
      order: { created_at: 'DESC' },
    });
  }

  async deactivateQR(id: string, tenantId: string): Promise<void> {
    await this.qrRepository.update(
      { id, tenant_id: tenantId },
      { is_active: false },
    );
  }

  async getQRData(shortUrl: string): Promise<any> {
    const qr = await this.findByShortUrl(shortUrl);
    if (!qr) {
      throw new Error('QR code not found');
    }
    return JSON.parse(qr.data);
  }
}
