import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { MenuEntity } from './menu.entity';
import { MenuItemEntity } from './menu-item.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuItemEntity)
    private menuItemRepository: Repository<MenuItemEntity>,
  ) {}

  async createMenu(tenantId: string, restaurantId: number, menuData: any): Promise<MenuEntity> {
    const menu = this.menuRepository.create({
      ...menuData,
      tenant_id: tenantId,
      restaurant_id: restaurantId,
    });
    return await this.menuRepository.save(menu);
  }

  async findAllMenus(tenantId: string, restaurantId: number): Promise<MenuEntity[]> {
    return this.menuRepository.find({
      where: { tenant_id: tenantId, restaurant_id: restaurantId },
    });
  }

  async findMenuById(id: number, tenantId: string): Promise<MenuEntity> {
    return this.menuRepository.findOne({
      where: { id, tenant_id: tenantId },
    });
  }

  async updateMenu(id: number, tenantId: string, updateData: any): Promise<MenuEntity> {
    await this.menuRepository.update({ id, tenant_id: tenantId }, updateData);
    return this.findMenuById(id, tenantId);
  }

  async deleteMenu(id: number, tenantId: string): Promise<void> {
    await this.menuRepository.delete({ id, tenant_id: tenantId });
  }

  async createMenuItem(menuId: number, itemData: any): Promise<MenuItemEntity> {
    const item = this.menuItemRepository.create({
      ...itemData,
      menu_id: menuId,
    });
    return await this.menuItemRepository.save(item);
  }

  async findMenuItems(menuId: number): Promise<MenuItemEntity[]> {
    return this.menuItemRepository.find({
      where: { menu_id: menuId },
      relations: ['menu'],
    });
  }

  async updateMenuItem(id: number, updateData: any): Promise<MenuItemEntity> {
    await this.menuItemRepository.update(id, updateData);
    return this.menuItemRepository.findOne({
      where: { id },
      relations: ['menu'],
    });
  }

  async deleteMenuItem(id: number): Promise<void> {
    await this.menuItemRepository.delete(id);
  }

  async uploadImageToS3(file: Express.Multer.File, key: string): Promise<string> {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET || 'flex-restro-images',
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as const,
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    return `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`;
  }
}
