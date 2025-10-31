import { MenuEntity } from './menu.entity';
export declare class MenuItemEntity {
    id: number;
    menu_id: number;
    menu: MenuEntity;
    name: string;
    price: number;
    variants: any;
    category: string;
    image_url: string;
    available: boolean;
    created_at: Date;
}
