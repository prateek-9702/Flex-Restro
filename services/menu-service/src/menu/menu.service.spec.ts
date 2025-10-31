import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuService } from './menu.service';
import { MenuEntity } from './menu.entity';
import { MenuItemEntity } from './menu-item.entity';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository: Repository<MenuEntity>;
  let menuItemRepository: Repository<MenuItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MenuItemEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<MenuEntity>>(getRepositoryToken(MenuEntity));
    menuItemRepository = module.get<Repository<MenuItemEntity>>(getRepositoryToken(MenuItemEntity));
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

      jest.spyOn(menuRepository, 'create').mockReturnValue(createdMenu as any);
      jest.spyOn(menuRepository, 'save').mockResolvedValue(createdMenu as any);

      const result = await service.createMenu(tenantId, restaurantId, menuData);
      expect(result).toEqual(createdMenu);
    });
  });

  describe('findAllMenus', () => {
    it('should return all menus for a tenant and restaurant', async () => {
      const tenantId = 'tenant1';
      const restaurantId = 1;
      const menus = [{ id: 1, name: 'Menu 1' }, { id: 2, name: 'Menu 2' }];

      jest.spyOn(menuRepository, 'find').mockResolvedValue(menus as any);

      const result = await service.findAllMenus(tenantId, restaurantId);
      expect(result).toEqual(menus);
    });
  });

  describe('createMenuItem', () => {
    it('should create a menu item', async () => {
      const itemData = { name: 'Test Item', price: 10.99 };
      const menuId = 1;
      const createdItem = { id: 1, ...itemData, menu_id: menuId };

      jest.spyOn(menuItemRepository, 'create').mockReturnValue(createdItem as any);
      jest.spyOn(menuItemRepository, 'save').mockResolvedValue(createdItem as any);

      const result = await service.createMenuItem(menuId, itemData);
      expect(result).toEqual(createdItem);
    });
  });
});
