import { Module } from '@nestjs/common';
import { NotificationController } from './notification/notification.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
