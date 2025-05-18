import { Product } from '@/types/Product';
import apiClient from './api';

export interface SearchProductsParams {
    query?: string;
    category?: string;
    price?: string; // dạng "min-max"
    rating?: number;
    order?: "featured" | "lowest" | "highest" | "toprated" | "newest";
    page?: number;
    pageSize?: number;
}

export interface SearchProductsResponse {
    products: Product[];
    total: number;
    page: number;
    pageSize: number;
}

export async function searchProducts(params: SearchProductsParams): Promise<SearchProductsResponse | null> {
    const query = new URLSearchParams();
    if (params.query) query.append("query", params.query);
    if (params.category) query.append("category", params.category);
    if (params.price) query.append("price", params.price);
    if (params.rating !== undefined) query.append("rating", params.rating.toString());
    if (params.order) query.append("order", params.order);
    if (params.page) query.append("page", params.page.toString());
    if (params.pageSize) query.append("pageSize", params.pageSize.toString());

    try {
        const response = await apiClient.get<SearchProductsResponse>(`/products/search?${query.toString()}`);
        return response.data;

    } catch (error) {
        console.error('Fetch product failed:', error);
        return null;
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const response = await apiClient.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Fetch product by id failed:', error);
        return null;
    }
}
