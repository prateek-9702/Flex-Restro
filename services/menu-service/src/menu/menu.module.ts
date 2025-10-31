import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { MenuEntity } from './menu.entity';
import { MenuItemEntity } from './menu-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity, MenuItemEntity])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
