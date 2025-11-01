import { Order } from './order.entity';
export declare class OrderItem {
    id: string;
    menu_item_id: string;
    menu_item_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    special_instructions: string;
    order: Order;
}
