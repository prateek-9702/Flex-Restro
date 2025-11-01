export declare enum QRType {
    RESTAURANT = "restaurant",
    TABLE = "table",
    ORDER = "order"
}
export declare class QR {
    id: string;
    tenant_id: string;
    restaurant_id: string;
    type: QRType;
    table_number: number;
    order_id: string;
    short_url: string;
    qr_code_url: string;
    data: string;
    is_active: boolean;
    created_at: Date;
}
