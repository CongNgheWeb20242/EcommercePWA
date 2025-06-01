import { Product } from '@/types/Product';
import apiClient from './api';
import { SearchProductsParams } from '@/types/SearchProductsParams';
import { Category } from '@/types/Category';

export interface SearchProductsResponse {
    products: Product[];
    countProducts: number;
    page: number;
    pages: number;
}

export async function searchProducts(params: SearchProductsParams): Promise<SearchProductsResponse | null> {
    const query = new URLSearchParams();
    if (params.query) query.append("query", params.query);
    if (params.category) query.append("category", params.category);
    if (params.color) query.append("color", params.color);
    if (params.brand) query.append("brand", params.brand);
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

interface CategoriesResponse {
    categories: Category[];
}

export async function getCategories(): Promise<Category[] | null> {
    try {
        const response = await apiClient.get<CategoriesResponse>('/products/categories');
        return response.data.categories;
    } catch (error) {
        console.error('Fetch categories failed:', error);
        return null;
    }
}

interface AddReviewProp {
    rating: number,
    comment: string
}


export async function addReview(body: AddReviewProp, productId: string): Promise<Boolean> {
    try {
        await apiClient.post(`/products/${productId}/reviews`, body);
        return true;
    } catch (error) {
        console.error('Add review failed:', error);
        return false;
    }
}

