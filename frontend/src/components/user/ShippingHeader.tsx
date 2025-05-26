import { ShippingHeaderProps } from "@/types/ShippingHeader";

const ShippingHeader: React.FC<ShippingHeaderProps> = ({
    startPoint,
    endPoint,
    isLoadingRoute,
    isAnimating
}) => {
    return (
        <div className="mb-6 relative z-20">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🚚 Theo dõi vận chuyển đơn hàng
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <p><strong>Mã đơn hàng:</strong> #DH123456789</p>
                <p><strong>Từ:</strong> {startPoint.name}</p>
                <p><strong>Đến:</strong> {endPoint.name}</p>
                <div className="flex items-center gap-2">
                    {isLoadingRoute ? (
                        <span className="text-blue-600 font-semibold">
                            ⏳ Đang tải tuyến đường...
                        </span>
                    ) : isAnimating ? (
                        <span className="text-blue-600 font-semibold">
                            🚛 Đang mô phỏng vận chuyển...
                        </span>
                    ) : (
                        <span className="text-green-600 font-semibold">✅ Đã giao thành công</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShippingHeader;
