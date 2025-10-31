import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantEntity } from '../restaurant.entity/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async create(restaurantData: Partial<RestaurantEntity>): Promise<RestaurantEntity> {
    const restaurant = this.restaurantRepository.create(restaurantData);
    return this.restaurantRepository.save(restaurant);
  }

  async findAll(tenantId: string): Promise<RestaurantEntity[]> {
    return this.restaurantRepository.find({ where: { tenant_id: tenantId } });
  }

  async findOne(id: string, tenantId: string): Promise<RestaurantEntity> {
    return this.restaurantRepository.findOne({ where: { id, tenant_id: tenantId } });
  }

  async update(id: string, tenantId: string, updateData: Partial<RestaurantEntity>): Promise<RestaurantEntity> {
    await this.restaurantRepository.update({ id, tenant_id: tenantId }, updateData);
    return this.findOne(id, tenantId);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    await this.restaurantRepository.delete({ id, tenant_id: tenantId });
  }
}
