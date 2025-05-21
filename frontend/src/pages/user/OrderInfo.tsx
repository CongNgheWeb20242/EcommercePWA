import CheckoutForm from "@/components/user/CheckoutForm";
import OrderSummary from "@/components/user/OrderSummary";

export default function OrderInfo() {
    return (
        <div className="w-full max-w-6xl flex md:flex-row gap-8 mx-auto">
            <CheckoutForm />
            <OrderSummary />
        </div>
    );
}
