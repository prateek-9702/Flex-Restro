import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QRController } from './qr.controller';
import { QRService } from './qr.service';
import { QR } from './qr.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QR])],
  controllers: [QRController],
  providers: [QRService],
  exports: [QRService],
})
export class QRModule {}
