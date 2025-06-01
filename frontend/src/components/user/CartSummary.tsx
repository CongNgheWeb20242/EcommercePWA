import React, { useState } from "react";
import useCartStore from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import useCheckoutStore from "@/store/useCheckOutStore";
import { userStore } from "@/store/userStore";

const CartSummary: React.FC = () => {
    const navigate = useNavigate();
    const { goToNextStep } = useCheckoutStore();
    const { clearCart, selectAll, deselectAll } = useCartStore();
    const [showClearCartDialog, setShowClearCartDialog] = useState(false);

    const total = useCartStore(state => state.totalPrice);
    const totalQuantity = useCartStore(state => state.totalItems);
    const user = userStore(state => state.user);

    // Disable nếu chưa đăng nhập hoặc không có sản phẩm
    const isCheckoutDisabled = totalQuantity === 0 || !user;

    const handleNext = () => {
        if (isCheckoutDisabled) return;
        navigate('/user/checkout');
        goToNextStep();
    };

    const handleClearCart = () => {
        clearCart();
        setShowClearCartDialog(false);
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
            {/* Dialog xác nhận */}
            {showClearCartDialog && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận xóa giỏ hàng</h3>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?</p>

                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                onClick={handleClearCart}
                            >
                                Xóa
                            </button>
                            <button
                                className="flex-1 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
                                onClick={() => setShowClearCartDialog(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                onClick={() => setShowClearCartDialog(true)}>
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
