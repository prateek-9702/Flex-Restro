import { Repository } from 'typeorm';
import { QR } from './qr.entity';
export declare class QRService {
    private qrRepository;
    private s3;
    constructor(qrRepository: Repository<QR>);
    generateRestaurantQR(restaurantId: string, tenantId: string): Promise<QR>;
    generateTableQR(restaurantId: string, tenantId: string, tableNumber: number): Promise<QR>;
    generateOrderQR(orderId: string, restaurantId: string, tenantId: string): Promise<QR>;
    findByShortUrl(shortUrl: string): Promise<QR | null>;
    findByRestaurant(restaurantId: string, tenantId: string): Promise<QR[]>;
    deactivateQR(id: string, tenantId: string): Promise<void>;
    getQRData(shortUrl: string): Promise<any>;
}
