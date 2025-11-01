import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const orderData = {
        restaurant_id: 'rest1',
        customer_name: 'John Doe',
        customer_phone: '1234567890',
        total_amount: 25.99,
      };
      const items = [
        {
          menu_item_id: 'item1',
          menu_item_name: 'Burger',
          quantity: 1,
          unit_price: 15.99,
          total_price: 15.99,
        },
        {
          menu_item_id: 'item2',
          menu_item_name: 'Fries',
          quantity: 1,
          unit_price: 10.00,
          total_price: 10.00,
        },
      ];
      const tenantId = 'tenant1';
      const createdOrder = { id: 'order1', ...orderData, tenant_id: tenantId, items };

      jest.spyOn(orderRepository, 'create').mockReturnValue(createdOrder as any);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(createdOrder as any);
      jest.spyOn(orderItemRepository, 'save').mockResolvedValue(items as any);
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(createdOrder as any);

      const result = await service.create({ ...orderData, tenant_id: tenantId }, items);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders for a tenant', async () => {
      const tenantId = 'tenant1';
      const orders = [
        { id: 'order1', customer_name: 'John' },
        { id: 'order2', customer_name: 'Jane' },
      ];

      jest.spyOn(orderRepository, 'find').mockResolvedValue(orders as any);

      const result = await service.findAll(tenantId);
      expect(result).toEqual(orders);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      const id = 'order1';
      const tenantId = 'tenant1';
      const order = { id, customer_name: 'John' };

      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(order as any);

      const result = await service.findOne(id, tenantId);
      expect(result).toEqual(order);
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      const id = 'order1';
      const tenantId = 'tenant1';
      const status = OrderStatus.CONFIRMED;
      const updatedOrder = { id, status };

      jest.spyOn(orderRepository, 'update').mockResolvedValue({ affected: 1 } as any);
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(updatedOrder as any);

      const result = await service.updateStatus(id, tenantId, status);
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('remove', () => {
    it('should delete an order', async () => {
      const id = 'order1';
      const tenantId = 'tenant1';

      jest.spyOn(orderRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await service.remove(id, tenantId);
      expect(orderRepository.delete).toHaveBeenCalledWith({ id, tenant_id: tenantId });
    });
  });
});
