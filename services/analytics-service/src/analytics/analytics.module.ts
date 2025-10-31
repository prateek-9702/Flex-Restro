import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsMetric, AnalyticsCache } from './analytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsMetric, AnalyticsCache])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
