import useCheckoutStore from "@/store/useCheckOutStore";
import CartPage from "./Cart";
import OrderInfo from "./OrderInfo";
import Payment from "./Payment";
import CheckoutProgressBar from "@/components/user/CheckoutProcessBar";

const CheckoutPage = () => {
    const { currentStep, customerInfo } = useCheckoutStore();

    // Render component theo bước hiện tại
    const renderStep = () => {
        switch (currentStep) {
            case 1: return <CartPage />;
            case 2: return <OrderInfo />;
            case 3: return customerInfo.paymentMethod !== 'cash'
                ? <Payment />
                : <Payment />;
            //   case 4: return customerInfo.paymentMethod !== 'cash' //TODO
            //     ? <ShippingStep onNext={handleNext} />
            //     : <CompleteStep />;
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
