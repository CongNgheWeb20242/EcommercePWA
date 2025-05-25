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
    order: {
        order_id: string;
        amount: number;
    }
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function createPaymentURL(body: CreatePaymentURLBody): Promise<CreatePaymentURLResponse | null> {
    await delay(3000);
    try {
        console.log('Creating payment with body:', body);
        const response = await apiClient.post<CreatePaymentURLResponse>(
            "/payment/create_payment_url",
            body
        );
        console.log('Create payment response:', response);
        return response.data;
    } catch (error) {
        console.error('Create payment failed:', error);
        return null;
    }
}
