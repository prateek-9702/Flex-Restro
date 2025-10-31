"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_service_1 = require("./menu.service");
const menu_entity_1 = require("./menu.entity");
const menu_item_entity_1 = require("./menu-item.entity");
describe('MenuService', () => {
    let service;
    let menuRepository;
    let menuItemRepository;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                menu_service_1.MenuService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(menu_entity_1.MenuEntity),
                    useClass: typeorm_2.Repository,
                },
                {
                    provide: (0, typeorm_1.getRepositoryToken)(menu_item_entity_1.MenuItemEntity),
                    useClass: typeorm_2.Repository,
                },
            ],
        }).compile();
        service = module.get(menu_service_1.MenuService);
        menuRepository = module.get((0, typeorm_1.getRepositoryToken)(menu_entity_1.MenuEntity));
        menuItemRepository = module.get((0, typeorm_1.getRepositoryToken)(menu_item_entity_1.MenuItemEntity));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('createMenu', () => {
        it('should create a menu', async () => {
            const menuData = { name: 'Test Menu', description: 'Test Description' };
            const tenantId = 'tenant1';
            const restaurantId = 1;
            const createdMenu = { id: 1, ...menuData, tenant_id: tenantId, restaurant_id: restaurantId };
            jest.spyOn(menuRepository, 'create').mockReturnValue(createdMenu);
            jest.spyOn(menuRepository, 'save').mockResolvedValue(createdMenu);
            const result = await service.createMenu(tenantId, restaurantId, menuData);
            expect(result).toEqual(createdMenu);
        });
    });
    describe('findAllMenus', () => {
        it('should return all menus for a tenant and restaurant', async () => {
            const tenantId = 'tenant1';
            const restaurantId = 1;
            const menus = [{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }];
            jest.spyOn(menuRepository, 'find').mockResolvedValue(menus);
            const result = await service.findAllMenus(tenantId, restaurantId);
            expect(result).toEqual(menus);
        });
    });
    describe('createMenuItem', () => {
        it('should create a menu item', async () => {
            const itemData = { name: 'Test Item', price: 10.99 };
            const menuId = 1;
            const createdItem = { id: 1, ...itemData, menu_id: menuId };
            jest.spyOn(menuItemRepository, 'create').mockReturnValue(createdItem);
            jest.spyOn(menuItemRepository, 'save').mockResolvedValue(createdItem);
            const result = await service.createMenuItem(menuId, itemData);
            expect(result).toEqual(createdItem);
        });
    });
});
//# sourceMappingURL=menu.service.spec.js.map