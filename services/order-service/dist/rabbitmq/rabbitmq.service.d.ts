import { ClientProxy } from '@nestjs/microservices';
export declare class RabbitmqService {
    private client;
    constructor(client: ClientProxy);
    publishOrderEvent(eventType: string, data: any): Promise<void>;
    publishOrderCreated(order: any): Promise<void>;
    publishOrderStatusUpdated(order: any, oldStatus: string): Promise<void>;
    publishOrderCancelled(order: any): Promise<void>;
}
