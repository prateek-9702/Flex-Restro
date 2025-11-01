import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentService } from './payment.service';
import { Payment, PaymentStatus } from './payment.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useClass: Repository,
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
    it('should create a payment intent', async () => {
      const orderId = 'order1';
      const amount = 25.99;
      const currency = 'usd';
      const tenantId = 'tenant1';
      const createdPayment = {
        id: 'payment1',
        order_id: orderId,
        amount,
        currency,
        tenant_id: tenantId,
        status: PaymentStatus.PENDING,
        stripe_payment_intent_id: 'pi_test123',
      };

      jest.spyOn(paymentRepository, 'create').mockReturnValue(createdPayment as any);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(createdPayment as any);

      // Mock Stripe
      const mockStripe = {
        paymentIntents: {
          create: jest.fn().mockResolvedValue({ id: 'pi_test123' }),
        },
      };
      (service as any).stripe = mockStripe;

      const result = await service.createPaymentIntent(orderId, amount, currency, tenantId);
      expect(result).toEqual(createdPayment);
    });
  });

  describe('confirmPayment', () => {
    it('should confirm a payment', async () => {
      const paymentIntentId = 'pi_test123';
      const tenantId = 'tenant1';
      const payment = {
        id: 'payment1',
        stripe_payment_intent_id: paymentIntentId,
        tenant_id: tenantId,
        status: PaymentStatus.SUCCEEDED,
      };

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(payment as any);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(payment as any);

      // Mock Stripe
      const mockStripe = {
        paymentIntents: {
          retrieve: jest.fn().mockResolvedValue({
            status: 'succeeded',
            charges: { data: [{ id: 'ch_test123' }] },
          }),
        },
      };
      (service as any).stripe = mockStripe;

      const result = await service.confirmPayment(paymentIntentId, tenantId);
      expect(result.status).toEqual(PaymentStatus.SUCCEEDED);
    });
  });

  describe('refundPayment', () => {
    it('should refund a payment', async () => {
      const paymentId = 'payment1';
      const tenantId = 'tenant1';
      const payment = {
        id: paymentId,
        tenant_id: tenantId,
        status: PaymentStatus.SUCCEEDED,
        stripe_payment_intent_id: 'pi_test123',
      };

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(payment as any);
      jest.spyOn(paymentRepository, 'save').mockResolvedValue({ ...payment, status: PaymentStatus.REFUNDED } as any);

      // Mock Stripe
      const mockStripe = {
        refunds: {
          create: jest.fn().mockResolvedValue({ id: 'ref_test123' }),
        },
      };
      (service as any).stripe = mockStripe;

      const result = await service.refundPayment(paymentId, tenantId);
      expect(result.status).toEqual(PaymentStatus.REFUNDED);
    });
  });

  describe('findAll', () => {
    it('should return all payments for a tenant', async () => {
      const tenantId = 'tenant1';
      const payments = [
        { id: 'payment1', amount: 25.99 },
        { id: 'payment2', amount: 15.50 },
      ];

      jest.spyOn(paymentRepository, 'find').mockResolvedValue(payments as any);

      const result = await service.findAll(tenantId);
      expect(result).toEqual(payments);
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      const id = 'payment1';
      const tenantId = 'tenant1';
      const payment = { id, amount: 25.99 };

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(payment as any);

      const result = await service.findOne(id, tenantId);
      expect(result).toEqual(payment);
    });
  });
});
