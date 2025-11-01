import { Repository } from 'typeorm';
import { RestaurantEntity } from '../restaurant.entity/restaurant.entity';
export declare class RestaurantService {
    private restaurantRepository;
    constructor(restaurantRepository: Repository<RestaurantEntity>);
    create(restaurantData: Partial<RestaurantEntity>): Promise<RestaurantEntity>;
    findAll(tenantId: string): Promise<RestaurantEntity[]>;
    findOne(id: string, tenantId: string): Promise<RestaurantEntity>;
    update(id: string, tenantId: string, updateData: Partial<RestaurantEntity>): Promise<RestaurantEntity>;
    remove(id: string, tenantId: string): Promise<void>;
}
