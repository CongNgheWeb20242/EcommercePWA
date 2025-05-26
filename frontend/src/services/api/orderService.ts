import apiClient from './api';
import { Order } from '@/types/Order';


export async function getUserOrder(): Promise<Order[] | null> {
    try {
        const response = await apiClient.get<Order[]>(`/orders/mine`);
        console.log('Fetch user order:', response);
        return response.data;
    } catch (error) {
        console.error('Fetch user order failed:', error);
        return null;
    }
}

export async function getOrderById(id: string): Promise<Order | null> {
    try {
        const response = await apiClient.get<Order>(`/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch order by id failed:', error);
        return null;
    }
}

export async function deliverOrder(orderId: string): Promise<string | null> {
    try {
        const response = await apiClient.put<{ message: string }>(
            `/orders/${orderId}/deliver`
        );
        return response.data.message;
    } catch (error) {
        console.error('Fetch order by id failed:', error);
        return null;
    }
}

