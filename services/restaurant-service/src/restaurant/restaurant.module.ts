import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from '../restaurant.entity/restaurant.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    AuthModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
