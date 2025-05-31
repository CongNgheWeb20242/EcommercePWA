import CheckoutForm from "@/components/user/CheckoutForm";
import OrderSummary from "@/components/user/OrderSummary";

export default function OrderInfo() {
    return (
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4 md:gap-8 mx-auto px-4 py-6">
            {/* CheckoutForm nằm trên mobile, trái trên desktop */}
            <div className="flex-1">
                <CheckoutForm />
            </div>
            {/* OrderSummary nằm dưới mobile, phải trên desktop */}
            <div className="w-full md:w-[380px] lg:w-[400px] flex-shrink-0">
                <OrderSummary />
            </div>
        </div>

    );
}
