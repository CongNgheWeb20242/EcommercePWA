import { CartItem } from '@/types/CartItem';
import { Product } from '@/types/Product';
import React from 'react';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
    // State
    cartIconRef: React.RefObject<HTMLButtonElement | null>;
    productImageRef: React.RefObject<HTMLDivElement | null>;
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    shippingFee: number;

    // Actions
    setCartIconRef: (ref: React.RefObject<HTMLButtonElement | null>) => void;
    setproductImageRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
    addItem: (product: Product, size: string, quantity?: number) => void;
    removeItem: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    updateSize: (productId: string, size: string) => void;
    selectItem: (productId: string, select: Boolean) => void;
    selectAll: () => void;
    deselectAll: () => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cartIconRef: React.createRef<HTMLButtonElement>(),
            productImageRef: React.createRef<HTMLDivElement>(),
            items: [],
            totalItems: 0,
            totalPrice: 0,
            shippingFee: 0,

            setCartIconRef: (ref) => {
                set({ cartIconRef: ref });
            },

            setproductImageRef: (ref) => {
                set({ productImageRef: ref });
            },

            // Thêm sản phẩm vào giỏ hàng
            addItem: (product, size, quantity = 1) => {
                const { items } = get();
                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa (cùng ID và cùng size)
                const existingItemIndex = items.findIndex(
                    item => item._id === product._id && item.size === size
                );

                let updatedItems: CartItem[];

                if (existingItemIndex >= 0) {
                    // Nếu sản phẩm đã tồn tại, tăng số lượng
                    updatedItems = items.map((item, index) => {
                        if (index === existingItemIndex) {
                            return { ...item, quantity: item.quantity + quantity };
                        }
                        return item;
                    });
                } else {
                    // Nếu sản phẩm chưa tồn tại, thêm mới
                    updatedItems = [
                        ...items,
                        {
                            ...product,
                            size,
                            quantity,
                            selected: false
                        }
                    ];
                }
                set({ items: updatedItems, });
            },

            // Xóa sản phẩm khỏi giỏ hàng
            removeItem: (productId) => {
                const { items } = get();
                const itemToRemove = items.find(item => item._id === productId);

                if (!itemToRemove) return;

                const updatedItems = items.filter(item => item._id !== productId);
                if (itemToRemove.selected) {
                    const newTotalItems = get().totalItems - itemToRemove.quantity;
                    const newTotalPrice = get().totalPrice - (itemToRemove.price * itemToRemove.quantity);
                    set({
                        totalItems: newTotalItems,
                        totalPrice: newTotalPrice,
                    });
                }
                set({ items: updatedItems, });
            },

            // Tăng số lượng sản phẩm
            increaseQuantity: (productId) => {
                const { items } = get();
                const existingItem = items.find(item => item._id === productId);

                if (!existingItem) return;

                const updatedItems = items.map(item => {
                    if (item._id === productId) {
                        return { ...item, quantity: item.quantity + 1 };
                    }
                    return item;
                });

                if (existingItem.selected) {
                    set({
                        totalItems: get().totalItems + 1,
                        totalPrice: get().totalPrice + existingItem.price,
                    });
                }

                set({ items: updatedItems, });
            },

            // Giảm số lượng sản phẩm
            decreaseQuantity: (productId) => {
                const { items } = get();
                const existingItem = items.find(item => item._id === productId);

                if (!existingItem) return;

                // Nếu số lượng = 1, xóa sản phẩm khỏi giỏ hàng
                if (existingItem.quantity === 1) {
                    return get().removeItem(productId);
                }

                // Giảm số lượng
                const updatedItems = items.map(item => {
                    if (item._id === productId) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                    return item;
                });

                if (existingItem.selected) {
                    set({
                        totalItems: get().totalItems - 1,
                        totalPrice: get().totalPrice - existingItem.price,
                    });
                }

                set({ items: updatedItems, });
            },

            // Cập nhật kích cỡ
            updateSize: (productId, newSize) => {
                const { items } = get();
                const updatedItems = items.map(item => {
                    if (item._id === productId) {
                        return { ...item, size: newSize };
                    }
                    return item;
                });

                set({ items: updatedItems });
            },

            // Chọn/Bỏ chọn sản phẩm để thanh toán
            selectItem: (productId, select) => {
                const { items } = get();
                var newTotalItems = get().totalItems;
                var newTotalPrice = get().totalPrice;

                const updatedItems = items.map(item => {
                    if (item._id === productId) {
                        if (select) {
                            newTotalItems += item.quantity;
                            newTotalPrice += item.price * item.quantity;
                        }
                        else {
                            newTotalItems -= item.quantity;
                            newTotalPrice -= item.price * item.quantity;
                        }
                        return { ...item, selected: select ? true : false };
                    }
                    return item;
                });

                set({
                    items: updatedItems,
                    totalItems: newTotalItems,
                    totalPrice: newTotalPrice,
                });
            },

            selectAll: () => {
                const { items } = get();
                const updatedItems = items.map(item => ({ ...item, selected: true }));
                const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

                set({
                    items: updatedItems,
                    totalItems: newTotalItems,
                    totalPrice: newTotalPrice,
                });
            },

            // Bỏ chọn tất cả sản phẩm
            deselectAll: () => {
                const { items } = get();
                const updatedItems = items.map(item => ({ ...item, selected: false }));

                set({
                    items: updatedItems,
                    totalItems: 0,
                    totalPrice: 0,
                });
            },

            // Xóa toàn bộ giỏ hàng
            clearCart: () => {
                set({
                    items: [],
                    totalItems: 0,
                    totalPrice: 0,
                });
            },
        }),
        {
            name: 'cart-storage', // Tên trong localStorage
            version: 1, // Phiên bản
            partialize: (state) => ({
                items: state.items,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice,
                shippingFee: state.shippingFee,
            }),
        }
    )
);

export default useCartStore;
