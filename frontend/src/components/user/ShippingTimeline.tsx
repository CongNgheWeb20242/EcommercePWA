import TimelineStep from './TimelineStep';
import DeliveryConfirmation from './DeliveryConfirmation';
import { ShippingTimelineProps } from '@/types/ShippingTimeline';

const ShippingTimeline: React.FC<ShippingTimelineProps> = ({
    steps,
    isAnimating,
    isLoadingRoute,
    isConfirmed,
    onConfirm
}) => {
    const getStatusMessage = () => {
        if (isLoadingRoute) return 'Vui lòng đợi tải dữ liệu tuyến đường';
        if (isAnimating) return 'Vui lòng đợi hoàn thành mô phỏng vận chuyển';
        return 'Nhấn để xác nhận bạn đã nhận được đơn hàng';
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 relative z-30">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                📍 Lịch trình vận chuyển (3 điểm tập kết)
                {isAnimating && (
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                        Đang mô phỏng
                    </span>
                )}
            </h2>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-gray-300 before:via-blue-400 before:to-gray-300">
                {steps.map((step, index) => (
                    <TimelineStep
                        key={step.id}
                        step={step}
                        isLast={index === steps.length - 1}
                    />
                ))}
            </div>

            <DeliveryConfirmation
                isConfirmed={isConfirmed}
                isDisabled={isAnimating || isLoadingRoute}
                onConfirm={onConfirm}
                statusMessage={getStatusMessage()}
            />
        </div>
    );
};

export default ShippingTimeline;
