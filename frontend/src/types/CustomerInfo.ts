import { PaymentMethod } from "./PaymentMethod";

export interface CustomerInfo {
    fullName: string;
    phone: string;
    email: string;
    province: string;
    district: string;
    ward: string;
    address: string;
    notes?: string;
    paymentMethod: PaymentMethod;
}