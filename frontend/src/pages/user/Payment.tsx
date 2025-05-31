import { useEffect, useState } from "react";
import VnPayLogo from "@/assets/common/vnpay.png";
import useCheckoutStore from "@/store/useCheckOutStore";
import { getOrderById } from "@/services/api/orderService";

export default function Payment() {
    const { paymentURL, goToNextStep, orderId } = useCheckoutStore(); // orderId phải có trong store
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    // Kiểm tra xem URL thanh toán đã sẵn sàng chưa
    const isLoading = !paymentURL;
    const isSuccess = orderStatus === "success";

    // Polling kiểm tra trạng thái đơn hàng
    useEffect(() => {
        if (!orderId) return;
        setIsPolling(true);

        const interval = setInterval(async () => {
            try {
                console.log(orderId)
                const order = await getOrderById(orderId);
                if (order == null)
                    console.log("null")
                setOrderStatus(order?.paymentResult?.status ? order?.paymentResult?.status : "pending");
                if (order?.paymentResult?.status && order?.paymentResult?.status === "success") {
                    clearInterval(interval);
                    setIsPolling(false);
                }
            } catch (err) {

            }
        }, 3000);

        return () => clearInterval(interval);
    }, [orderId]);

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded shadow p-8 mt-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Thanh toán đơn hàng</h2>
            <p className="mb-4 text-gray-700">Vui lòng nhấp vào link để thanh toán:</p>

            <a
                href={paymentURL || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full mb-4 flex items-center justify-center gap-2 font-semibold py-3 rounded transition ${isLoading
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                onClick={(e) => {
                    if (isLoading) e.preventDefault()
                }}
            >
                <img
                    src={VnPayLogo}
                    alt="VNPay"
                    className="h-6 rounded-circle"
                />
                {isLoading ? "Đang tải..." : "Thanh toán qua VNPay"}
            </a>

            <button
                onClick={() => goToNextStep()}
                className={`w-full bg-blue-600 text-white font-semibold py-3 rounded transition ${!isSuccess ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                    }`}
            // disabled={!isSuccess}
            >
                {!isSuccess
                    ? isPolling
                        ? "Đang kiểm tra trạng thái đơn hàng..."
                        : "Vui lòng đợi..."
                    : "Tiếp tục"}
            </button>
        </div>
    );
}
