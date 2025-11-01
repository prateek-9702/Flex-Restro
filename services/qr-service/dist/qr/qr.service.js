"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const QRCode = require("qrcode");
const shortid = require("shortid");
const aws_sdk_1 = require("aws-sdk");
const qr_entity_1 = require("./qr.entity");
let QRService = class QRService {
    constructor(qrRepository) {
        this.qrRepository = qrRepository;
        this.s3 = new aws_sdk_1.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
    }
    async generateRestaurantQR(restaurantId, tenantId) {
        const data = {
            type: qr_entity_1.QRType.RESTAURANT,
            restaurantId,
            tenantId,
        };
        const qrDataString = JSON.stringify(data);
        const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
        const shortUrl = shortid.generate();
        const s3Key = `qr-codes/restaurant-${restaurantId}-${Date.now()}.png`;
        await this.s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: qrCodeBuffer,
            ContentType: 'image/png',
            ACL: 'public-read',
        }).promise();
        const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        const qr = this.qrRepository.create({
            tenant_id: tenantId,
            restaurant_id: restaurantId,
            type: qr_entity_1.QRType.RESTAURANT,
            short_url: shortUrl,
            qr_code_url: qrCodeUrl,
            data: qrDataString,
        });
        return this.qrRepository.save(qr);
    }
    async generateTableQR(restaurantId, tenantId, tableNumber) {
        const data = {
            type: qr_entity_1.QRType.TABLE,
            restaurantId,
            tenantId,
            tableNumber,
        };
        const qrDataString = JSON.stringify(data);
        const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
        const shortUrl = shortid.generate();
        const s3Key = `qr-codes/table-${restaurantId}-${tableNumber}-${Date.now()}.png`;
        await this.s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: qrCodeBuffer,
            ContentType: 'image/png',
            ACL: 'public-read',
        }).promise();
        const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        const qr = this.qrRepository.create({
            tenant_id: tenantId,
            restaurant_id: restaurantId,
            type: qr_entity_1.QRType.TABLE,
            table_number: tableNumber,
            short_url: shortUrl,
            qr_code_url: qrCodeUrl,
            data: qrDataString,
        });
        return this.qrRepository.save(qr);
    }
    async generateOrderQR(orderId, restaurantId, tenantId) {
        const data = {
            type: qr_entity_1.QRType.ORDER,
            orderId,
            restaurantId,
            tenantId,
        };
        const qrDataString = JSON.stringify(data);
        const qrCodeBuffer = await QRCode.toBuffer(qrDataString);
        const shortUrl = shortid.generate();
        const s3Key = `qr-codes/order-${orderId}-${Date.now()}.png`;
        await this.s3.upload({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: qrCodeBuffer,
            ContentType: 'image/png',
            ACL: 'public-read',
        }).promise();
        const qrCodeUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
        const qr = this.qrRepository.create({
            tenant_id: tenantId,
            restaurant_id: restaurantId,
            type: qr_entity_1.QRType.ORDER,
            order_id: orderId,
            short_url: shortUrl,
            qr_code_url: qrCodeUrl,
            data: qrDataString,
        });
        return this.qrRepository.save(qr);
    }
    async findByShortUrl(shortUrl) {
        return this.qrRepository.findOne({ where: { short_url: shortUrl, is_active: true } });
    }
    async findByRestaurant(restaurantId, tenantId) {
        return this.qrRepository.find({
            where: { restaurant_id: restaurantId, tenant_id: tenantId },
            order: { created_at: 'DESC' },
        });
    }
    async deactivateQR(id, tenantId) {
        await this.qrRepository.update({ id, tenant_id: tenantId }, { is_active: false });
    }
    async getQRData(shortUrl) {
        const qr = await this.findByShortUrl(shortUrl);
        if (!qr) {
            throw new Error('QR code not found');
        }
        return JSON.parse(qr.data);
    }
};
exports.QRService = QRService;
exports.QRService = QRService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(qr_entity_1.QR)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QRService);
//# sourceMappingURL=qr.service.js.map