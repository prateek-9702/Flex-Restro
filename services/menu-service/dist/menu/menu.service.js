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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_s3_1 = require("@aws-sdk/client-s3");
const menu_entity_1 = require("./menu.entity");
const menu_item_entity_1 = require("./menu-item.entity");
let MenuService = class MenuService {
    constructor(menuRepository, menuItemRepository) {
        this.menuRepository = menuRepository;
        this.menuItemRepository = menuItemRepository;
    }
    async createMenu(tenantId, restaurantId, menuData) {
        const menu = this.menuRepository.create({
            ...menuData,
            tenant_id: tenantId,
            restaurant_id: restaurantId,
        });
        return await this.menuRepository.save(menu);
    }
    async findAllMenus(tenantId, restaurantId) {
        return this.menuRepository.find({
            where: { tenant_id: tenantId, restaurant_id: restaurantId },
        });
    }
    async findMenuById(id, tenantId) {
        return this.menuRepository.findOne({
            where: { id, tenant_id: tenantId },
        });
    }
    async updateMenu(id, tenantId, updateData) {
        await this.menuRepository.update({ id, tenant_id: tenantId }, updateData);
        return this.findMenuById(id, tenantId);
    }
    async deleteMenu(id, tenantId) {
        await this.menuRepository.delete({ id, tenant_id: tenantId });
    }
    async createMenuItem(menuId, itemData) {
        const item = this.menuItemRepository.create({
            ...itemData,
            menu_id: menuId,
        });
        return await this.menuItemRepository.save(item);
    }
    async findMenuItems(menuId) {
        return this.menuItemRepository.find({
            where: { menu_id: menuId },
            relations: ['menu'],
        });
    }
    async updateMenuItem(id, updateData) {
        await this.menuItemRepository.update(id, updateData);
        return this.menuItemRepository.findOne({
            where: { id },
            relations: ['menu'],
        });
    }
    async deleteMenuItem(id) {
        await this.menuItemRepository.delete(id);
    }
    async uploadImageToS3(file, key) {
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
        });
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET || 'flex-restro-images',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
        };
        const command = new client_s3_1.PutObjectCommand(uploadParams);
        await s3Client.send(command);
        return `https://${uploadParams.Bucket}.s3.amazonaws.com/${key}`;
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.MenuEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(menu_item_entity_1.MenuItemEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MenuService);
//# sourceMappingURL=menu.service.js.map