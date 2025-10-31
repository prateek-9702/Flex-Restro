import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { RestaurantEntity } from '../restaurant.entity/restaurant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'flex_restro',
      entities: [RestaurantEntity],
      synchronize: true, // Set to false in production
    }),
    RestaurantModule,
  ],
})
export class AppModule {}
