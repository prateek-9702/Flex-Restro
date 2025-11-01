export declare enum PaymentStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    CANCELLED = "cancelled",
    REFUNDED = "refunded"
}
export declare enum PaymentMethod {
    CARD = "card",
    UPI = "upi",
    NET_BANKING = "net_banking",
    WALLET = "wallet"
}
export declare class Payment {
    id: string;
    tenant_id: string;
    order_id: string;
    amount: number;
    currency: string;
    payment_method: PaymentMethod;
    status: PaymentStatus;
    stripe_payment_intent_id: string;
    stripe_charge_id: string;
    failure_reason: string;
    metadata: Record<string, any>;
    created_at: Date;
    updated_at: Date;
}
