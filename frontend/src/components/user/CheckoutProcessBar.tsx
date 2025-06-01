import React from "react";

interface CheckoutProgressBarProps {
    currentStep: number; // 1, 2, 3, 4
}

const steps = [
    { label: "Cart" },
    { label: "Order Info" },
    { label: "Payment" },
    { label: "Complete" },
];

const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({ currentStep }) => {
    return (
        <div className="w-full flex flex-col items-center py-4 sm:py-6">
            <div className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">Checkout Process</div>
            <div className="flex items-center w-full max-w-xs sm:max-w-xl justify-between">
                {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                        <div className="flex flex-col items-center min-w-[48px]">
                            <div
                                className={`flex items-center justify-center rounded-full w-10 h-10 sm:w-12 sm:h-12 text-white font-bold text-base sm:text-lg border-2 transition
                                    ${currentStep === idx + 1
                                        ? "bg-blue-600 border-blue-600 shadow-lg"
                                        : currentStep > idx + 1
                                            ? "bg-green-500 border-green-500"
                                            : "bg-gray-300 border-gray-300"
                                    }
                                `}
                            >
                                {currentStep > idx + 1 ? (
                                    <span className="text-lg">✓</span>
                                ) : (
                                    idx + 1
                                )}
                            </div>
                            <div className={`mt-2 text-xs sm:text-sm font-medium transition
                                ${currentStep === idx + 1
                                    ? "text-blue-600"
                                    : currentStep > idx + 1
                                        ? "text-green-600"
                                        : "text-gray-500"
                                }
                            `}>
                                {step.label}
                            </div>
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`
                                flex-1 h-1 mx-1 sm:mx-2 transition-all duration-300
                                ${currentStep > idx + 1
                                    ? "bg-green-500"
                                    : currentStep === idx + 1
                                        ? "bg-blue-400"
                                        : "bg-gray-300"
                                }
                            `} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CheckoutProgressBar;
