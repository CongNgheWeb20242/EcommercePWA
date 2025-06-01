import { createPaymentURL } from '@/services/api/paymentServices';
import { CustomerInfo } from '@/types/CustomerInfo';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userStore } from './userStore';
import useCartStore from './useCartStore';
import { deliverOrder } from '@/services/api/orderService';

export type OrderStatus = 'cart' | 'information' | 'payment' | 'complete';

interface CheckoutState {
    currentStep: number; // 1: Cart, 2: Information, 3: Payment, 4: Complete
    customerInfo: CustomerInfo;
    paymentStatus: 'pending' | 'completed' | 'failed';
    orderId?: string;
    paymentURL?: string;

    // Actions
    setStep: (step: number) => void;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    getOrderStatus: () => OrderStatus;
    updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
    setPaymentStatus: (status: 'pending' | 'completed' | 'failed') => void;
    setorderId: (id: string) => void;
    resetCheckout: () => void;
    needsPaymentStep: () => boolean;
    setPaymentURL?: (url: string) => void;
    clearAll: () => void;
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
        paymentMethod: 'cod' as const,
    },
    paymentStatus: 'pending' as const,
    shippingStatus: 'pending' as const,
};

export const useCheckoutStore = create<CheckoutState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setStep: (step) => set({ currentStep: step }),

            setPaymentURL: (url) => set({ paymentURL: url }),

            goToNextStep: () => {
                const { currentStep, needsPaymentStep } = get();
                const maxSteps = needsPaymentStep() ? 5 : 4;

                if (currentStep < maxSteps) {
                    var nextStep = currentStep + 1;

                    switch (nextStep) {
                        case 3:
                            if (!needsPaymentStep()) {
                                deliverOrder(get().orderId!);
                                nextStep = 4;
                            }
                            else {
                                const createPayment = async () => {
                                    const user = userStore.getState().user; // Lấy state trực tiếp
                                    const selectCartItem = useCartStore.getState().items.filter(item => item.selected === true);

                                    await createPaymentURL({
                                        fullName: get().customerInfo.fullName,
                                        phone: get().customerInfo.phone,
                                        email: get().customerInfo.email,
                                        address: get().customerInfo.address,
                                        detailedAddress: `${get().customerInfo.ward}, ${get().customerInfo.district}, ${get().customerInfo.province}`,
                                        note: get().customerInfo.notes || '',
                                        paymentMethod: get().customerInfo.paymentMethod,
                                        shippingFee: 0,
                                        taxRate: 0,
                                        user: user!._id,
                                        products: selectCartItem.map(item => ({
                                            id: item._id,
                                            price: item.price,
                                            quantity: item.quantity,
                                        })),
                                    }).then(response => {
                                        if (response && response.success) {
                                            set({
                                                paymentURL: response.paymentUrl,
                                                orderId: response.order._id,
                                            });
                                        }
                                    })
                                }
                                createPayment();
                            }
                            break;

                        case 4:
                            deliverOrder(get().orderId!);
                            break;

                    }

                    set({
                        currentStep: nextStep,
                    });
                }
            },

            getOrderStatus: () => {
                const { currentStep, needsPaymentStep } = get();
                let orderStatus: OrderStatus = 'cart';
                switch (currentStep) {
                    case 1: orderStatus = 'cart'; break;
                    case 2: orderStatus = 'information'; break;
                    case 3: orderStatus = needsPaymentStep() ? 'payment' : 'complete'; break;
                    case 4: orderStatus = 'complete'; break;
                }
                return orderStatus;
            },

            goToPreviousStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    const prevStep = currentStep - 1;

                    set({
                        currentStep: prevStep,
                    });
                }
            },

            // Cập nhật thông tin khách hàng
            updateCustomerInfo: (info) => set((state) => ({
                customerInfo: { ...state.customerInfo, ...info }
            })),

            // Cập nhật trạng thái thanh toán
            setPaymentStatus: (status) => set({ paymentStatus: status }),

            // Đặt mã thanh toán
            setorderId: (id) => set({ orderId: id }),

            // Đặt lại toàn bộ quá trình
            resetCheckout: () => set({ ...initialState }),

            // Kiểm tra xem có cần bước thanh toán hay không (nếu COD thì không cần)
            needsPaymentStep: () => {
                const { customerInfo } = get();
                return customerInfo.paymentMethod !== 'cod';
            },

            clearAll: () => set({
                currentStep: 1,
                orderId: undefined,
                paymentURL: undefined,
                customerInfo: {
                    fullName: '',
                    phone: '',
                    email: '',
                    province: '',
                    district: '',
                    ward: '',
                    address: '',
                    notes: '',
                    paymentMethod: 'cod' as const,
                },
                paymentStatus: 'pending',
            }),
        }),

        {
            name: 'checkout-store',
            version: 1,
        }
    )
);

export default useCheckoutStore;
