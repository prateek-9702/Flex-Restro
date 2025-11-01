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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const order_item_entity_1 = require("./order-item.entity");
const rabbitmq_service_1 = require("../rabbitmq/rabbitmq.service");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, rabbitmqService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.rabbitmqService = rabbitmqService;
    }
    async create(createOrderDto, tenantId) {
        const { items, ...orderData } = createOrderDto;
        const order = this.orderRepository.create({
            ...orderData,
            tenant_id: tenantId,
            status: order_entity_1.OrderStatus.PENDING,
        });
        const savedOrder = await this.orderRepository.save(order);
        if (items && items.length > 0) {
            const orderItems = items.map((item) => ({
                menu_item_id: item.menu_item_id,
                menu_item_name: item.menu_item_name,
                quantity: item.quantity,
                unit_price: item.unit_price,
                total_price: item.total_price,
                special_instructions: item.special_instructions,
                order: savedOrder,
            }));
            await this.orderItemRepository.save(orderItems);
            savedOrder.items = orderItems;
        }
        await this.rabbitmqService.publishOrderCreated(savedOrder);
        return savedOrder;
    }
    async findAll(tenantId) {
        return this.orderRepository.find({
            where: { tenant_id: tenantId },
            relations: ['items'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id, tenantId) {
        return this.orderRepository.findOne({
            where: { id, tenant_id: tenantId },
            relations: ['items'],
        });
    }
    async updateStatus(id, status, tenantId) {
        const order = await this.findOne(id, tenantId);
        if (!order) {
            throw new Error('Order not found');
        }
        const oldStatus = order.status;
        order.status = status;
        order.updated_at = new Date();
        const updatedOrder = await this.orderRepository.save(order);
        await this.rabbitmqService.publishOrderStatusUpdated(updatedOrder, oldStatus);
        return updatedOrder;
    }
    async remove(id, tenantId) {
        const order = await this.findOne(id, tenantId);
        if (!order) {
            throw new Error('Order not found');
        }
        if (order.status !== order_entity_1.OrderStatus.CANCELLED) {
            order.status = order_entity_1.OrderStatus.CANCELLED;
            order.updated_at = new Date();
            await this.orderRepository.save(order);
            await this.rabbitmqService.publishOrderCancelled(order);
        }
        await this.orderRepository.delete({ id, tenant_id: tenantId });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        rabbitmq_service_1.RabbitmqService])
], OrderService);
//# sourceMappingURL=order.service.js.map