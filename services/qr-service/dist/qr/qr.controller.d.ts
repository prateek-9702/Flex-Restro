import { QRService } from './qr.service';
export declare class QRController {
    private readonly qrService;
    constructor(qrService: QRService);
    generateRestaurantQR(body: {
        restaurantId: string;
        tenantId: string;
    }): Promise<import("./qr.entity").QR>;
    generateTableQR(body: {
        restaurantId: string;
        tenantId: string;
        tableNumber: number;
    }): Promise<import("./qr.entity").QR>;
    generateOrderQR(body: {
        orderId: string;
        restaurantId: string;
        tenantId: string;
    }): Promise<import("./qr.entity").QR>;
    getRestaurantQRs(restaurantId: string, tenantId: string): Promise<import("./qr.entity").QR[]>;
    getQRData(shortUrl: string): Promise<any>;
    deactivateQR(id: string, tenantId: string): Promise<{
        message: string;
    }>;
}
