import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { RabbitmqService } from '../rabbitmq/rabbitmq.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let orderItemRepository: Repository<OrderItem>;
  let rabbitmqService: RabbitmqService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRabbitmqService = {
    publishOrderCreated: jest.fn(),
    publishOrderStatusUpdated: jest.fn(),
    publishOrderCancelled: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: RabbitmqService,
          useValue: mockRabbitmqService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    rabbitmqService = module.get<RabbitmqService>(RabbitmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with items and publish event', async () => {
      const createOrderDto = {
        restaurant_id: 'rest-1',
        customer_name: 'John Doe',
        customer_phone: '1234567890',
        total_amount: 25.99,
        items: [
          { menu_item_id: 'item-1', menu_item_name: 'Item 1', quantity: 2, unit_price: 10.00, total_price: 20.00 },
          { menu_item_id: 'item-2', menu_item_name: 'Item 2', quantity: 1, unit_price: 5.99, total_price: 5.99 },
        ],
      };
      const tenantId = 'tenant-1';

      const mockOrder = { id: 'order-1', restaurant_id: 'rest-1', customer_name: 'John Doe', customer_phone: '1234567890', total_amount: 25.99, tenant_id: tenantId, status: OrderStatus.PENDING };
      const mockOrderItems = createOrderDto.items.map(item => ({ ...item, order: mockOrder }));

      mockOrderRepository.create.mockReturnValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(mockOrder);
      mockOrderItemRepository.create.mockImplementation(item => item);
      mockOrderItemRepository.save.mockResolvedValue(mockOrderItems);
      mockOrderRepository.findOne.mockResolvedValue({ ...mockOrder, items: mockOrderItems });

      const result = await service.create(createOrderDto, tenantId);

      expect(mockOrderRepository.create).toHaveBeenCalledWith({
        restaurant_id: 'rest-1',
        customer_name: 'John Doe',
        customer_phone: '1234567890',
        total_amount: 25.99,
        tenant_id: tenantId,
        status: OrderStatus.PENDING,
      });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(mockOrderItemRepository.save).toHaveBeenCalled();
      expect(mockRabbitmqService.publishOrderCreated).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual({ ...mockOrder, items: mockOrderItems });
    });
  });

  describe('findAll', () => {
    it('should return all orders for a tenant', async () => {
      const tenantId = 'tenant-1';
      const mockOrders = [{ id: 'order-1', tenant_id: tenantId }];

      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll(tenantId);

      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        relations: ['items'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateStatus', () => {
    it('should update order status and publish event', async () => {
      const orderId = 'order-1';
      const tenantId = 'tenant-1';
      const newStatus = OrderStatus.CONFIRMED;

      const mockOrder = { id: orderId, tenant_id: tenantId, status: OrderStatus.PENDING };
      const updatedOrder = { ...mockOrder, status: newStatus };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus(orderId, newStatus, tenantId);

      expect(mockOrderRepository.save).toHaveBeenCalledWith({
        ...mockOrder,
        status: newStatus,
        updated_at: expect.any(Date),
      });
      expect(mockRabbitmqService.publishOrderStatusUpdated).toHaveBeenCalledWith(updatedOrder, OrderStatus.PENDING);
      expect(result).toEqual(updatedOrder);
    });

    it('should throw error if order not found', async () => {
      const orderId = 'order-1';
      const tenantId = 'tenant-1';

      mockOrderRepository.findOne.mockResolvedValue(null);

      await expect(service.updateStatus(orderId, OrderStatus.CONFIRMED, tenantId)).rejects.toThrow('Order not found');
    });
  });

  describe('remove', () => {
    it('should cancel order and publish cancellation event', async () => {
      const orderId = 'order-1';
      const tenantId = 'tenant-1';

      const mockOrder = { id: orderId, tenant_id: tenantId, status: OrderStatus.CONFIRMED };

      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue({ ...mockOrder, status: OrderStatus.CANCELLED });

      await service.remove(orderId, tenantId);

      expect(mockOrderRepository.save).toHaveBeenCalledWith({
        ...mockOrder,
        status: OrderStatus.CANCELLED,
        updated_at: expect.any(Date),
      });
      expect(mockRabbitmqService.publishOrderCancelled).toHaveBeenCalledWith({
        ...mockOrder,
        status: OrderStatus.CANCELLED,
        updated_at: expect.any(Date),
      });
      expect(mockOrderRepository.delete).toHaveBeenCalledWith({ id: orderId, tenant_id: tenantId });
    });
  });
});
