import useCheckoutStore from "@/store/useCheckOutStore";
import CartPage from "./Cart";
import OrderInfo from "./OrderInfo";
import Payment from "./Payment";
import CheckoutProgressBar from "@/components/user/CheckoutProcessBar";
import ShippingPage from "../../components/user/ShippingPage";

const CheckoutPage = () => {
    const { currentStep } = useCheckoutStore();

    // Render component theo bước hiện tại
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <CartPage />;
            case 2: return <OrderInfo />;
            case 3: return <Payment />
            case 4: return <ShippingPage />;
            //   case 5: return <CompleteStep />;
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
