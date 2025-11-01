import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QRService } from './qr.service';
import { QR, QRType } from './qr.entity';

describe('QRService', () => {
  let service: QRService;
  let qrRepository: Repository<QR>;

  const mockQRRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QRService,
        {
          provide: getRepositoryToken(QR),
          useValue: mockQRRepository,
        },
      ],
    }).compile();

    service = module.get<QRService>(QRService);
    qrRepository = module.get<Repository<QR>>(getRepositoryToken(QR));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRestaurantQR', () => {
    it('should generate a restaurant QR code', async () => {
      const restaurantId = 'rest-123';
      const tenantId = 'tenant-123';
      const mockQR = {
        id: 'qr-123',
        tenant_id: tenantId,
        restaurant_id: restaurantId,
        type: QRType.RESTAURANT,
        short_url: 'short123',
        qr_code_url: 'https://s3.amazonaws.com/qr-codes/restaurant-rest-123.png',
        data: JSON.stringify({ type: QRType.RESTAURANT, restaurantId, tenantId }),
      };

      mockQRRepository.create.mockReturnValue(mockQR);
      mockQRRepository.save.mockResolvedValue(mockQR);

      // Mock QRCode.toBuffer and S3 upload
      const QRCode = require('qrcode');
      jest.spyOn(QRCode, 'toBuffer').mockResolvedValue(Buffer.from('mock-qr'));

      const s3UploadMock = jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Location: mockQR.qr_code_url })
      });
      service['s3'] = { upload: s3UploadMock } as any;

      const result = await service.generateRestaurantQR(restaurantId, tenantId);

      expect(result).toEqual(mockQR);
      expect(mockQRRepository.create).toHaveBeenCalled();
      expect(mockQRRepository.save).toHaveBeenCalled();
    });
  });

  describe('findByShortUrl', () => {
    it('should find QR by short URL', async () => {
      const shortUrl = 'short123';
      const mockQR = { id: 'qr-123', short_url: shortUrl };

      mockQRRepository.findOne.mockResolvedValue(mockQR);

      const result = await service.findByShortUrl(shortUrl);

      expect(result).toEqual(mockQR);
      expect(mockQRRepository.findOne).toHaveBeenCalledWith({
        where: { short_url: shortUrl, is_active: true },
      });
    });
  });

  describe('getQRData', () => {
    it('should return parsed QR data', async () => {
      const shortUrl = 'short123';
      const mockQR = {
        id: 'qr-123',
        short_url: shortUrl,
        data: JSON.stringify({ type: QRType.RESTAURANT, restaurantId: 'rest-123' }),
      };

      mockQRRepository.findOne.mockResolvedValue(mockQR);

      const result = await service.getQRData(shortUrl);

      expect(result).toEqual(JSON.parse(mockQR.data));
    });

    it('should throw error if QR not found', async () => {
      const shortUrl = 'short123';
      mockQRRepository.findOne.mockResolvedValue(null);

      await expect(service.getQRData(shortUrl)).rejects.toThrow('QR code not found');
    });
  });
});
