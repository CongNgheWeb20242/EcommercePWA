import useCheckoutStore from "@/store/useCheckOutStore";
import CartPage from "./Cart";
import OrderInfo from "./OrderInfo";
import Payment from "./Payment";
import CheckoutProgressBar from "@/components/user/CheckoutProcessBar";
import Complete from "@/components/user/Complete";

const CheckoutPage = () => {
    const { currentStep } = useCheckoutStore();

    // Render component theo bước hiện tại
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <CartPage />;
            case 2: return <OrderInfo />;
            case 3: return <Payment />
            case 4: return <Complete />;
            default: return null;
        }
    };

    return (
        <div>
            <CheckoutProgressBar currentStep={currentStep} />
            {renderStep()}
        </div>
    );
};

export default CheckoutPage;
