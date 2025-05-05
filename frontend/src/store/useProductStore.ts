import { searchProducts, SearchProductsParams } from "@/services/api/productService";
import { Product } from "@/types/Product";
import { create } from "zustand";

interface ProductState {
    products: Product[];
    total: number;
    loading: boolean;
    error: string | null;
    searchParams: SearchProductsParams;
    fetchProducts: (params?: SearchProductsParams) => Promise<void>;
    setSearchParams: (params: SearchProductsParams) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    total: 0,
    loading: false,
    error: null,
    searchParams: {
        page: 1,
        pageSize: 3,
    },
    fetchProducts: async (params) => {
        set({ loading: true, error: null });
        try {
            const mergedParams = { ...get().searchParams, ...params };
            const data = await searchProducts(mergedParams);
            if (data === null) throw new Error("Failed to fetch products");
            set({
                products: data.products,
                total: data.total,
                loading: false,
                searchParams: mergedParams,
            });
        } catch (err: any) {
            set({ error: err.message || "Error", loading: false });
        }
    },
    setSearchParams: (params) => set({ searchParams: { ...get().searchParams, ...params } }),
}));
