import { CartItem } from '@/types/CartItem';
import { Product } from '@/types/Product';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Định nghĩa interface cho state
interface CartState {
    // State
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
    shippingFee: number;

    // Actions
    addItem: (product: Product, size: number, quantity?: number) => void;
    removeItem: (productId: string) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    updateSize: (productId: string, size: number) => void;
    clearCart: () => void;
}

// Tạo store với Zustand
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            totalItems: 0,
            totalPrice: 0,
            shippingFee: 0,

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
                            quantity
                        }
                    ];
                }

                // Cập nhật state
                const newTotalItems = get().totalItems + quantity;
                const newTotalPrice = get().totalPrice + (product.price * quantity);

                set({
                    items: updatedItems,
                    totalItems: newTotalItems,
                    totalPrice: newTotalPrice,
                });
            },

            // Xóa sản phẩm khỏi giỏ hàng
            removeItem: (productId) => {
                const { items } = get();
                const itemToRemove = items.find(item => item._id === productId);

                if (!itemToRemove) return;

                const updatedItems = items.filter(item => item._id !== productId);
                const newTotalItems = get().totalItems - itemToRemove.quantity;
                const newTotalPrice = get().totalPrice - (itemToRemove.price * itemToRemove.quantity);

                set({
                    items: updatedItems,
                    totalItems: newTotalItems,
                    totalPrice: newTotalPrice,
                });
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

                set({
                    items: updatedItems,
                    totalItems: get().totalItems + 1,
                    totalPrice: get().totalPrice + existingItem.price,
                });
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

                set({
                    items: updatedItems,
                    totalItems: get().totalItems - 1,
                    totalPrice: get().totalPrice - existingItem.price,
                });
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
            version: 1, // Phiên bản, hữu ích khi cấu trúc state thay đổi
        }
    )
);

export default useCartStore;
