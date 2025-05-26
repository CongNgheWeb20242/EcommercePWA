export interface OrderItem {
    product: string;
    quantity: number;
    price: number;
}

export interface Location {
    lat?: number;
    lng?: number;
    address?: string;
    name?: string;
    vicinity?: string;
    googleAddressId?: string;
}

export interface ShippingAddress {
    fullName: string;
    address: string;
    city: string;
    postalCode?: string;
    country: string;
    location?: Location;
}

export interface PaymentResult {
    id?: string;
    status?: string;
    update_time?: string;
    amount?: number;
    bankCode?: string; // VNPay
    payType?: string; // MoMo: 'captureWallet', 'payWithATM'
}

export interface Order {
    _id?: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    paymentResult?: PaymentResult;
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
    user: string; // ObjectId as string
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
