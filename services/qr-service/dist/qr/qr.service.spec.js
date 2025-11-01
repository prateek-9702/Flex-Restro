"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const qr_service_1 = require("./qr.service");
const qr_entity_1 = require("./qr.entity");
describe('QRService', () => {
    let service;
    let qrRepository;
    const mockQRRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        update: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                qr_service_1.QRService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(qr_entity_1.QR),
                    useValue: mockQRRepository,
                },
            ],
        }).compile();
        service = module.get(qr_service_1.QRService);
        qrRepository = module.get((0, typeorm_1.getRepositoryToken)(qr_entity_1.QR));
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
                type: qr_entity_1.QRType.RESTAURANT,
                short_url: 'short123',
                qr_code_url: 'https://s3.amazonaws.com/qr-codes/restaurant-rest-123.png',
                data: JSON.stringify({ type: qr_entity_1.QRType.RESTAURANT, restaurantId, tenantId }),
            };
            mockQRRepository.create.mockReturnValue(mockQR);
            mockQRRepository.save.mockResolvedValue(mockQR);
            const QRCode = require('qrcode');
            jest.spyOn(QRCode, 'toBuffer').mockResolvedValue(Buffer.from('mock-qr'));
            const s3UploadMock = jest.fn().mockReturnValue({
                promise: jest.fn().mockResolvedValue({ Location: mockQR.qr_code_url })
            });
            service['s3'] = { upload: s3UploadMock };
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
                data: JSON.stringify({ type: qr_entity_1.QRType.RESTAURANT, restaurantId: 'rest-123' }),
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
//# sourceMappingURL=qr.service.spec.js.map