import { Repository } from 'typeorm';
import { MenuEntity } from './menu.entity';
import { MenuItemEntity } from './menu-item.entity';
export declare class MenuService {
    private menuRepository;
    private menuItemRepository;
    constructor(menuRepository: Repository<MenuEntity>, menuItemRepository: Repository<MenuItemEntity>);
    createMenu(tenantId: string, restaurantId: number, menuData: any): Promise<MenuEntity>;
    findAllMenus(tenantId: string, restaurantId: number): Promise<MenuEntity[]>;
    findMenuById(id: number, tenantId: string): Promise<MenuEntity>;
    updateMenu(id: number, tenantId: string, updateData: any): Promise<MenuEntity>;
    deleteMenu(id: number, tenantId: string): Promise<void>;
    createMenuItem(menuId: number, itemData: any): Promise<MenuItemEntity>;
    findMenuItems(menuId: number): Promise<MenuItemEntity[]>;
    updateMenuItem(id: number, updateData: any): Promise<MenuItemEntity>;
    deleteMenuItem(id: number): Promise<void>;
    uploadImageToS3(file: Express.Multer.File, key: string): Promise<string>;
}
