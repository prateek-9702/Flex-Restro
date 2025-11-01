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
exports.RabbitmqService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let RabbitmqService = class RabbitmqService {
    constructor(client) {
        this.client = client;
    }
    async publishOrderEvent(eventType, data) {
        try {
            await this.client.emit(eventType, data).toPromise();
            console.log(`Published order event: ${eventType}`, data);
        }
        catch (error) {
            console.error(`Failed to publish order event: ${eventType}`, error);
        }
    }
    async publishOrderCreated(order) {
        await this.publishOrderEvent('order.created', {
            orderId: order.id,
            tenantId: order.tenant_id,
            totalAmount: order.total_amount,
            status: order.status,
            items: order.orderItems?.map(item => ({
                menuItemId: item.menu_item_id,
                quantity: item.quantity,
                price: item.price,
            })),
            createdAt: order.created_at,
        });
    }
    async publishOrderStatusUpdated(order, oldStatus) {
        await this.publishOrderEvent('order.status.updated', {
            orderId: order.id,
            tenantId: order.tenant_id,
            oldStatus,
            newStatus: order.status,
            updatedAt: order.updated_at,
        });
    }
    async publishOrderCancelled(order) {
        await this.publishOrderEvent('order.cancelled', {
            orderId: order.id,
            tenantId: order.tenant_id,
            reason: order.cancellation_reason,
            cancelledAt: order.updated_at,
        });
    }
};
exports.RabbitmqService = RabbitmqService;
exports.RabbitmqService = RabbitmqService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RABBITMQ_SERVICE')),
    __metadata("design:paramtypes", [microservices_1.ClientProxy])
], RabbitmqService);
//# sourceMappingURL=rabbitmq.service.js.map