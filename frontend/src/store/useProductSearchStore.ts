import { searchProducts } from "@/services/api/productService";
import { Product } from "@/types/Product";
import { SearchProductsParams } from "@/types/SearchProductsParams";
import { create } from "zustand";

interface SearchState {
    products: Product[];
    loading: boolean;
    error: string | null;
    searchParams: SearchProductsParams;
    fetchProducts: (params?: SearchProductsParams) => Promise<void>;
    setSearchParams: (params: SearchProductsParams) => void;
}


export const useProductSearchStore = create<SearchState>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    searchParams: {
        page: 1,
        pageSize: 10,
    },
    fetchProducts: async (params) => {
        set({ loading: true, error: null });
        try {
            const mergedParams = { ...get().searchParams, ...params };
            const data = await searchProducts(mergedParams);
            if (data === null) throw new Error("Failed to fetch products");
            set({
                products: data.products,
                loading: false,
                searchParams: mergedParams,
            });
        } catch (err: any) {
            set({ error: err.message || "Error", loading: false });
        }
    },
    setSearchParams: (params) => set({ searchParams: { ...get().searchParams, ...params } }),
}));
