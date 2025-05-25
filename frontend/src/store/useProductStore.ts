import { searchProducts } from "@/services/api/productService";
import { Product } from "@/types/Product";
import { SearchProductsParams } from "@/types/SearchProductsParams";
import { create } from "zustand";

interface ProductState {
    //state
    products: Product[];
    currentPage: number;
    pages: number | null;
    loading: boolean;
    error: string | null;
    searchParams: SearchProductsParams;

    //actions
    setCurrentPage: (page: number) => void;
    fetchProducts: (params?: SearchProductsParams) => Promise<void>;
    setSearchParams: (params: SearchProductsParams) => void;
}


export const useProductStore = create<ProductState>((set, get) => ({
    products: [],
    currentPage: 1,
    pages: null,
    loading: false,
    error: null,
    searchParams: {},

    setCurrentPage: (page) => set({ currentPage: page }),

    fetchProducts: async (params) => {
        set({ loading: !params?.append, error: null });
        try {
            const mergedParams = { ...get().searchParams, ...params };
            const data = await searchProducts(mergedParams);

            if (data === null) return

            set({
                products: params?.append
                    ? [...get().products, ...data.products]
                    : data.products,
                currentPage: data.page,
                pages: data.pages,
                loading: false,
                searchParams: mergedParams,
            });

        } catch (err: any) {
            set({ error: err.message || "Error", loading: false });
        }
    },
    setSearchParams: (params) => set({ searchParams: { ...get().searchParams, ...params } }),
}));
