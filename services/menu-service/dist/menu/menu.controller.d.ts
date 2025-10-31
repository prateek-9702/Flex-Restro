import { MenuService } from './menu.service';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    create(createMenuDto: any, req: any): Promise<import("./menu.entity").MenuEntity>;
    findAll(req: any): Promise<import("./menu.entity").MenuEntity[]>;
    findOne(id: string, req: any): Promise<import("./menu.entity").MenuEntity>;
    update(id: string, updateMenuDto: any, req: any): Promise<import("./menu.entity").MenuEntity>;
    remove(id: string, req: any): Promise<void>;
    createItem(menuId: string, createItemDto: any): Promise<import("./menu-item.entity").MenuItemEntity>;
    findItems(menuId: string): Promise<import("./menu-item.entity").MenuItemEntity[]>;
    updateItem(id: string, updateItemDto: any): Promise<import("./menu-item.entity").MenuItemEntity>;
    removeItem(id: string): Promise<void>;
    uploadImage(file: Express.Multer.File): Promise<{
        message: string;
        imageUrl: string;
    }>;
}
