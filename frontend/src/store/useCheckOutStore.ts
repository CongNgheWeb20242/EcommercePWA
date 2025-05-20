import { CustomerInfo } from '@/types/CustomerInfo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'cart' | 'information' | 'payment' | 'shipping' | 'complete';

interface CheckoutState {
    currentStep: number; // 1: Cart, 2: Information, 3: Payment, 4: Shipping, 5: Complete
    orderStatus: OrderStatus;
    customerInfo: CustomerInfo;
    paymentStatus: 'pending' | 'completed' | 'failed';
    shippingStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
    orderCode?: string;
    paymentId?: string;

    // Actions
    setStep: (step: number) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    setOrderStatus: (status: OrderStatus) => void;
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
    setPaymentStatus: (status: 'pending' | 'completed' | 'failed') => void;
    setShippingStatus: (status: 'pending' | 'processing' | 'shipped' | 'delivered') => void;
    setOrderCode: (code: string) => void;
    setPaymentId: (id: string) => void;
    resetCheckout: () => void;
    needsPaymentStep: () => boolean;
}

// Giá trị mặc định cho store
const initialState = {
    currentStep: 1,
    orderStatus: 'cart' as OrderStatus,
    customerInfo: {
        fullName: '',
        phone: '',
        email: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        notes: '',
        paymentMethod: 'cash' as const,
    },
    paymentStatus: 'pending' as const,
    shippingStatus: 'pending' as const,
};

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setStep: (step) => set({ currentStep: step }),

            goToNextStep: () => {
                const { currentStep, needsPaymentStep } = get();
                const maxSteps = needsPaymentStep() ? 5 : 4;

                if (currentStep < maxSteps) {
                    const nextStep = currentStep + 1;

                    // Cập nhật trạng thái đơn hàng theo bước
                    let orderStatus: OrderStatus = 'cart';
                    switch (nextStep) {
                        case 2: orderStatus = 'information'; break;
                        case 3: orderStatus = needsPaymentStep() ? 'payment' : 'shipping'; break;
                        case 4: orderStatus = needsPaymentStep() ? 'shipping' : 'complete'; break;
                        case 5: orderStatus = 'complete'; break;
                    }

                    set({
                        currentStep: nextStep,
                        orderStatus: orderStatus
                    });
                }
            },

            goToPreviousStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    const prevStep = currentStep - 1;

                    // Cập nhật trạng thái đơn hàng theo bước
                    let orderStatus: OrderStatus = 'cart';
                    switch (prevStep) {
                        case 1: orderStatus = 'cart'; break;
                        case 2: orderStatus = 'information'; break;
                        case 3: orderStatus = get().needsPaymentStep() ? 'payment' : 'shipping'; break;
                        case 4: orderStatus = 'shipping'; break;
                    }

                    set({
                        currentStep: prevStep,
                        orderStatus: orderStatus
                    });
                }
            },

            // Cập nhật trạng thái đơn hàng
            setOrderStatus: (status) => set({ orderStatus: status }),

            // Cập nhật thông tin khách hàng
            updateCustomerInfo: (info) => set((state) => ({
                customerInfo: { ...state.customerInfo, ...info }
            })),

            // Cập nhật trạng thái thanh toán
            setPaymentStatus: (status) => set({ paymentStatus: status }),

            // Cập nhật trạng thái giao hàng
            setShippingStatus: (status) => set({ shippingStatus: status }),

            // Đặt mã đơn hàng
            setOrderCode: (code) => set({ orderCode: code }),

            // Đặt mã thanh toán
            setPaymentId: (id) => set({ paymentId: id }),

            // Đặt lại toàn bộ quá trình
            resetCheckout: () => set({ ...initialState }),

            // Kiểm tra xem có cần bước thanh toán hay không (nếu COD thì không cần)
            needsPaymentStep: () => {
                const { customerInfo } = get();
                return customerInfo.paymentMethod !== 'cash';
            }
        }),
        {
            name: 'checkout-store',
            version: 1,
        }
    )
);

export default useCheckoutStore;
