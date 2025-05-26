import { ShippingStep } from "@/types/ShippingStep";

interface TimelineStepProps {
    step: ShippingStep;
    isLast: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, isLast }) => {
    return (
        <div className="relative flex items-start gap-4">
            <div className={`
                relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 transition-all duration-500
                ${step.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : step.animationActive
                        ? 'bg-blue-500 border-blue-500 text-white animate-pulse shadow-lg scale-110'
                        : 'bg-gray-300 border-gray-300 text-gray-600'
                }
            `}>
                {step.completed ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : step.animationActive ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                ) : (
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                )}
            </div>

            <div className={`
                flex-1 pb-6 transition-all duration-500
                ${step.animationActive ? 'transform scale-105' : ''}
                ${isLast ? 'pb-0' : ''}
            `}>
                <div className={`
                    p-4 rounded-lg border-l-4 transition-all duration-500
                    ${step.completed
                        ? 'bg-green-50 border-green-400'
                        : step.animationActive
                            ? 'bg-blue-50 border-blue-400 shadow-lg'
                            : 'bg-gray-50 border-gray-300'
                    }
                `}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`
                            font-semibold text-lg transition-colors duration-300
                            ${step.completed
                                ? 'text-green-800'
                                : step.animationActive
                                    ? 'text-blue-800'
                                    : 'text-gray-600'
                            }
                        `}>
                            {step.title}
                        </h3>
                        {step.completed && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Hoàn thành
                            </span>
                        )}
                        {step.animationActive && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                                Đang xử lý
                            </span>
                        )}
                    </div>
                    <p className="text-gray-700 mb-2">{step.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>📍 {step.location}</span>
                        <span>🕒 {step.timestamp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimelineStep;
