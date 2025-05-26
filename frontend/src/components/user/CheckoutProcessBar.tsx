import React from "react";

interface CheckoutProgressBarProps {
    currentStep: number; // 1, 2, 3, 4
}

const steps = [
    { label: "Cart" },
    { label: "Order Info" },
    { label: "Payment" },
    { label: "Shipping" },
    { label: "Complete" },
];

const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ currentStep }) => {
    return (
        <div className="w-full flex flex-col items-center py-6">
            <div className="text-2xl font-semibold mb-6">Checkout Process</div>
            <div className="flex items-center w-full max-w-xl justify-between">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex items-center justify-center rounded-full w-12 h-12 text-white font-bold text-lg
                  ${currentStep === idx + 1
                                        ? "bg-blue-600 shadow-lg"
                                        : currentStep > idx + 1
                                            ? "bg-blue-400"
                                            : "bg-blue-300"
                                    }
                `}
                            >
                                {idx + 1}
                            </div>
                            <div className="mt-2 text-sm font-medium text-gray-700">{step.label}</div>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className="flex-1 h-1 bg-blue-300 mx-2" />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CheckoutProgressBar;
