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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuItemEntity = void 0;
const typeorm_1 = require("typeorm");
const menu_entity_1 = require("./menu.entity");
let MenuItemEntity = class MenuItemEntity {
};
exports.MenuItemEntity = MenuItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MenuItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MenuItemEntity.prototype, "menu_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => menu_entity_1.MenuEntity),
    (0, typeorm_1.JoinColumn)({ name: 'menu_id' }),
    __metadata("design:type", menu_entity_1.MenuEntity)
], MenuItemEntity.prototype, "menu", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MenuItemEntity.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], MenuItemEntity.prototype, "variants", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MenuItemEntity.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], MenuItemEntity.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MenuItemEntity.prototype, "created_at", void 0);
exports.MenuItemEntity = MenuItemEntity = __decorate([
    (0, typeorm_1.Entity)('menu_items')
], MenuItemEntity);
//# sourceMappingURL=menu-item.entity.js.map