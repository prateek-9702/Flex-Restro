import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from './payment.service';
import { Payment, PaymentStatus, PaymentMethod } from './payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;

  const mockPaymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<Payment>>(getRepositoryToken(Payment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const orderId = 'order-1';
      const amount = 25.99;
      const currency = 'usd';
      const tenantId = 'tenant-1';

      const mockPaymentIntent = {
        id: 'pi_123',
        client_secret: 'secret_123',
      };

      const mockPayment = {
        id: 'payment-1',
        tenant_id: tenantId,
        order_id: orderId,
        amount,
        currency,
        stripe_payment_intent_id: mockPaymentIntent.id,
        status: PaymentStatus.PENDING,
      };

      // Mock Stripe
      const stripeMock = {
        paymentIntents: {
          create: jest.fn().mockResolvedValue(mockPaymentIntent),
        },
      };
      (service as any).stripe = stripeMock;

      mockPaymentRepository.create.mockReturnValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);

      const result = await service.createPaymentIntent(orderId, amount, currency, tenantId);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.create).toHaveBeenCalledWith({
        tenant_id: tenantId,
        order_id: orderId,
        amount,
        currency,
        stripe_payment_intent_id: mockPaymentIntent.id,
        status: PaymentStatus.PENDING,
      });
    });

    it('should handle Stripe errors', async () => {
      const orderId = 'order-1';
      const amount = 25.99;
      const tenantId = 'tenant-1';

      const stripeMock = {
        paymentIntents: {
          create: jest.fn().mockRejectedValue(new Error('Stripe error')),
        },
      };
      (service as any).stripe = stripeMock;

      await expect(service.createPaymentIntent(orderId, amount, 'usd', tenantId)).rejects.toThrow('Failed to create payment intent: Stripe error');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm a successful payment', async () => {
      const paymentIntentId = 'pi_123';
      const tenantId = 'tenant-1';

      const mockPayment = {
        id: 'payment-1',
        stripe_payment_intent_id: paymentIntentId,
        status: PaymentStatus.PENDING,
      };

      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'succeeded',
        latest_charge: { id: 'ch_123' },
      };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const stripeMock = {
        paymentIntents: {
          retrieve: jest.fn().mockResolvedValue(mockPaymentIntent),
        },
      };
      (service as any).stripe = stripeMock;

      mockPaymentRepository.save.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.SUCCEEDED,
        stripe_charge_id: 'ch_123',
      });

      const result = await service.confirmPayment(paymentIntentId, tenantId);

      expect(result.status).toBe(PaymentStatus.SUCCEEDED);
      expect(result.stripe_charge_id).toBe('ch_123');
    });

    it('should handle failed payment', async () => {
      const paymentIntentId = 'pi_123';
      const tenantId = 'tenant-1';

      const mockPayment = {
        id: 'payment-1',
        stripe_payment_intent_id: paymentIntentId,
        status: PaymentStatus.PENDING,
      };

      const mockPaymentIntent = {
        id: paymentIntentId,
        status: 'requires_payment_method',
        last_payment_error: { message: 'Card declined' },
      };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const stripeMock = {
        paymentIntents: {
          retrieve: jest.fn().mockResolvedValue(mockPaymentIntent),
        },
      };
      (service as any).stripe = stripeMock;

      mockPaymentRepository.save.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.FAILED,
        failure_reason: 'Card declined',
      });

      const result = await service.confirmPayment(paymentIntentId, tenantId);

      expect(result.status).toBe(PaymentStatus.FAILED);
      expect(result.failure_reason).toBe('Card declined');
    });
  });

  describe('refundPayment', () => {
    it('should refund a successful payment', async () => {
      const paymentId = 'payment-1';
      const tenantId = 'tenant-1';

      const mockPayment = {
        id: paymentId,
        status: PaymentStatus.SUCCEEDED,
        stripe_payment_intent_id: 'pi_123',
      };

      const mockRefund = { id: 'ref_123' };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      const stripeMock = {
        refunds: {
          create: jest.fn().mockResolvedValue(mockRefund),
        },
      };
      (service as any).stripe = stripeMock;

      mockPaymentRepository.save.mockResolvedValue({
        ...mockPayment,
        status: PaymentStatus.REFUNDED,
        metadata: { refund_id: 'ref_123' },
      });

      const result = await service.refundPayment(paymentId, tenantId);

      expect(result.status).toBe(PaymentStatus.REFUNDED);
      expect(result.metadata.refund_id).toBe('ref_123');
    });

    it('should throw error for non-succeeded payment', async () => {
      const paymentId = 'payment-1';
      const tenantId = 'tenant-1';

      const mockPayment = {
        id: paymentId,
        status: PaymentStatus.PENDING,
      };

      mockPaymentRepository.findOne.mockResolvedValue(mockPayment);

      await expect(service.refundPayment(paymentId, tenantId)).rejects.toThrow('Only succeeded payments can be refunded');
    });
  });

  describe('findAll', () => {
    it('should return all payments for a tenant', async () => {
      const tenantId = 'tenant-1';
      const mockPayments = [{ id: 'payment-1', tenant_id: tenantId }];

      mockPaymentRepository.find.mockResolvedValue(mockPayments);

      const result = await service.findAll(tenantId);

      expect(mockPaymentRepository.find).toHaveBeenCalledWith({
        where: { tenant_id: tenantId },
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockPayments);
    });
  });
});
