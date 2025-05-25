import { SortType } from "./SortType";

export interface SearchProductsParams {
    query?: string;
    category?: string;
    price?: string;
    rating?: number;
    brand?: string;
    color?: string;
    order?: SortType;
    page?: number;
    pageSize?: number;
    append?: boolean;
}