import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'flex_user',
      password: process.env.DB_PASSWORD || 'flex_pass',
      database: process.env.DB_NAME || 'flex_restro',
      entities: [User],
      synchronize: true, // Set to false in production
    }),
    AuthModule,
  ],
})
export class AppModule {}
