// stores/useOrderStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, OrderItem, ShippingAddress, PaymentResult } from '@/types/Order';

interface OrderState {
    // Current order being created/edited
    currentOrder: Partial<Order>;

    // Order history
    orderHistory: Order[];

    // Loading states
    isLoading: boolean;
    isCreatingOrder: boolean;

    // Actions for current order
    initializeOrder: (userId: string) => void;
    setOrderItems: (items: OrderItem[]) => void;
    setShippingAddress: (address: ShippingAddress) => void;
    setPaymentMethod: (method: string) => void;
    setPaymentResult: (result: PaymentResult) => void;
    updatePrices: (itemsPrice: number, shippingPrice: number, taxPrice: number) => void;
    markAsPaid: () => void;
    markAsDelivered: () => void;

    // Actions for order management
    addToOrderHistory: (order: Order) => void;
    updateOrderInHistory: (orderId: string, updates: Partial<Order>) => void;
    removeFromOrderHistory: (orderId: string) => void;
    getOrderById: (orderId: string) => Order | undefined;

    // Utility actions
    clearCurrentOrder: () => void;
    clearOrderHistory: () => void;
    setLoading: (loading: boolean) => void;
    setCreatingOrder: (creating: boolean) => void;

    // Computed values
    getCurrentOrderTotal: () => number;
    getPendingOrders: () => Order[];
    getPaidOrders: () => Order[];
    getDeliveredOrders: () => Order[];
}

const initialShippingAddress: ShippingAddress = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Vietnam',
};

const initialOrder: Partial<Order> = {
    orderItems: [],
    shippingAddress: initialShippingAddress,
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
    isPaid: false,
    isDelivered: false,
};

export const useOrderStore = create<OrderState>()(
    persist(
        (set, get) => ({
            currentOrder: { ...initialOrder },
            orderHistory: [],
            isLoading: false,
            isCreatingOrder: false,

            // Initialize order with user ID
            initializeOrder: (userId: string) => {
                set({
                    currentOrder: {
                        ...initialOrder,
                        user: userId,
                        orderItems: [],
                        shippingAddress: { ...initialShippingAddress },
                    }
                });
            },

            // Set order items from cart
            setOrderItems: (items: OrderItem[]) => {
                const { currentOrder } = get();
                const itemsPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

                set({
                    currentOrder: {
                        ...currentOrder,
                        orderItems: items,
                        itemsPrice,
                        totalPrice: itemsPrice + (currentOrder.shippingPrice || 0) + (currentOrder.taxPrice || 0),
                    }
                });
            },

            // Set shipping address
            setShippingAddress: (address: ShippingAddress) => {
                const { currentOrder } = get();
                set({
                    currentOrder: {
                        ...currentOrder,
                        shippingAddress: address,
                    }
                });
            },

            // Set payment method
            setPaymentMethod: (method: string) => {
                const { currentOrder } = get();
                set({
                    currentOrder: {
                        ...currentOrder,
                        paymentMethod: method,
                    }
                });
            },

            // Set payment result after payment
            setPaymentResult: (result: PaymentResult) => {
                const { currentOrder } = get();
                set({
                    currentOrder: {
                        ...currentOrder,
                        paymentResult: result,
                        isPaid: result.status === 'PAID' || result.status === '00', // VNPay success code
                        paidAt: result.status === 'PAID' || result.status === '00' ? new Date() : undefined,
                    }
                });
            },

            // Update prices (items, shipping, tax)
            updatePrices: (itemsPrice: number, shippingPrice: number, taxPrice: number) => {
                const { currentOrder } = get();
                const totalPrice = itemsPrice + shippingPrice + taxPrice;

                set({
                    currentOrder: {
                        ...currentOrder,
                        itemsPrice,
                        shippingPrice,
                        taxPrice,
                        totalPrice,
                    }
                });
            },

            // Mark order as paid
            markAsPaid: () => {
                const { currentOrder } = get();
                set({
                    currentOrder: {
                        ...currentOrder,
                        isPaid: true,
                        paidAt: new Date(),
                    }
                });
            },

            // Mark order as delivered
            markAsDelivered: () => {
                const { currentOrder } = get();
                set({
                    currentOrder: {
                        ...currentOrder,
                        isDelivered: true,
                        deliveredAt: new Date(),
                    }
                });
            },

            // Add completed order to history
            addToOrderHistory: (order: Order) => {
                const { orderHistory } = get();
                set({
                    orderHistory: [order, ...orderHistory],
                });
            },

            // Update existing order in history
            updateOrderInHistory: (orderId: string, updates: Partial<Order>) => {
                const { orderHistory } = get();
                const updatedHistory = orderHistory.map(order =>
                    order._id === orderId ? { ...order, ...updates } : order
                );

                set({ orderHistory: updatedHistory });
            },

            // Remove order from history
            removeFromOrderHistory: (orderId: string) => {
                const { orderHistory } = get();
                const filteredHistory = orderHistory.filter(order => order._id !== orderId);

                set({ orderHistory: filteredHistory });
            },

            // Get specific order by ID
            getOrderById: (orderId: string) => {
                const { orderHistory } = get();
                return orderHistory.find(order => order._id === orderId);
            },

            // Clear current order
            clearCurrentOrder: () => {
                set({ currentOrder: { ...initialOrder } });
            },

            // Clear all order history
            clearOrderHistory: () => {
                set({ orderHistory: [] });
            },

            // Set loading state
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            // Set creating order state
            setCreatingOrder: (creating: boolean) => {
                set({ isCreatingOrder: creating });
            },

            // Computed: Get current order total
            getCurrentOrderTotal: () => {
                const { currentOrder } = get();
                return currentOrder.totalPrice || 0;
            },

            // Computed: Get pending orders
            getPendingOrders: () => {
                const { orderHistory } = get();
                return orderHistory.filter(order => !order.isPaid);
            },

            // Computed: Get paid orders
            getPaidOrders: () => {
                const { orderHistory } = get();
                return orderHistory.filter(order => order.isPaid && !order.isDelivered);
            },

            // Computed: Get delivered orders
            getDeliveredOrders: () => {
                const { orderHistory } = get();
                return orderHistory.filter(order => order.isDelivered);
            },
        }),
        {
            name: 'order-storage',
            version: 1,
            partialize: (state) => ({
                currentOrder: state.currentOrder,
                orderHistory: state.orderHistory,
            }),
        }
    )
);

export default useOrderStore;
