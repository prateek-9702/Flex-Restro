import { RestaurantService } from './restaurant.service';
export declare class RestaurantController {
    private readonly restaurantService;
    private readonly logger;
    constructor(restaurantService: RestaurantService);
    create(createRestaurantDto: any, req: any): Promise<import("../restaurant.entity/restaurant.entity").RestaurantEntity>;
    findAll(req: any): Promise<import("../restaurant.entity/restaurant.entity").RestaurantEntity[]>;
    findOne(id: string, req: any): Promise<import("../restaurant.entity/restaurant.entity").RestaurantEntity>;
    update(id: string, updateRestaurantDto: any, req: any): Promise<import("../restaurant.entity/restaurant.entity").RestaurantEntity>;
    remove(id: string, req: any): Promise<void>;
    welcome(req: any): {
        message: string;
    };
}
