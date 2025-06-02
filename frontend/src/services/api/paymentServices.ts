import { Order } from '@/types/Order';
import apiClient from './api';

interface CreatePaymentURLBody {
    fullName: string,
    phone: string,
    email: string,
    address: string,
    detailedAddress: string,
    note: string,
    paymentMethod: string,
    shippingFee: number,
    taxRate: number,
    user: string,
    products: {
        id: string,
        price: number,
        quantity: number
    }[]
}

interface CreatePaymentURLResponse {
    success: boolean;
    paymentUrl: string;
    order: Order
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function createPaymentURL(body: CreatePaymentURLBody): Promise<CreatePaymentURLResponse | null> {
    await delay(1000);
    try {
        const response = await apiClient.post<CreatePaymentURLResponse>(
            "/payment/create_payment_url",
            body
        );
        return response.data;
    } catch (error) {
        console.error('Create payment failed:', error);
        return null;
    }
}
