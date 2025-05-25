import React from "react";
import useCartStore from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import useCheckoutStore from "@/store/useCheckOutStore";
import { useAuthStore } from "@/store/useAuthStore";

const CartSummary: React.FC = () => {
    const navigate = useNavigate();
    const { goToNextStep } = useCheckoutStore();
    const { clearCart, selectAll, deselectAll } = useCartStore();
    const total = useCartStore(state => state.totalPrice);
    const totalQuantity = useCartStore(state => state.totalItems);
    const user = useAuthStore(state => state.user);

    // Disable nếu chưa đăng nhập hoặc không có sản phẩm
    const isCheckoutDisabled = totalQuantity === 0 || !user;

    const handleNext = () => {
        if (isCheckoutDisabled) return;
        navigate('/user/checkout');
        goToNextStep();
    };

    return (
        <div className="w-full lg:w-96 bg-gray-50 rounded-lg p-6 border">
            <div className="font-semibold text-lg mb-4">
                TỔNG CỘNG | {totalQuantity} SẢN PHẨM
            </div>
            <table className="w-full text-sm mb-4">
                <tbody>
                    <tr>
                        <td className="py-1">Tạm tính</td>
                        <td className="py-1 text-right font-semibold">
                            <span className="text-red-600 font-bold text-md">
                                {total.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1">Phí Vận Chuyển</td>
                        <td className="py-1 text-right">Miễn phí vận chuyển</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-semibold">Tổng Cộng</td>
                        <td className="py-1 text-right font-bold text-red-600">
                            <span className="text-red-600 font-bold text-md">
                                {total.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button
                className={`w-full py-3 rounded font-semibold mb-3 transition ${isCheckoutDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                onClick={handleNext}
                disabled={isCheckoutDisabled}
                title={
                    !user
                        ? "Bạn cần đăng nhập để thanh toán"
                        : totalQuantity === 0
                            ? "Không có sản phẩm nào để thanh toán"
                            : ""
                }
            >
                Tiến hành thanh toán
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={selectAll}>
                Chọn tất cả
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={deselectAll}>
                Bỏ chọn tất cả
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={clearCart}>
                Xóa giỏ hàng
            </button>
            {!user && (
                <div className="text-red-500 text-sm mt-2 text-center">
                    Vui lòng đăng nhập để tiến hành thanh toán.
                </div>
            )}
        </div>
    );
};

export default CartSummary;
