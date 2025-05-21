import React from "react";
import useCartStore from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";
import useCheckoutStore from "@/store/useCheckOutStore";


const CartSummary: React.FC = () => {
    const navigate = useNavigate();
    const { goToNextStep } = useCheckoutStore();
    const { clearCart, selectAll, deselectAll } = useCartStore();
    const total = useCartStore(state => state.totalPrice);
    const totalQuantity = useCartStore(state => state.totalItems);

    const handleNext = () => {
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
                        <td className="py-1 text-right font-semibold">{total.toLocaleString("vi-VN")} đ</td>
                    </tr>
                    <tr>
                        <td className="py-1">Phí Vận Chuyển</td>
                        <td className="py-1 text-right">Miễn phí vận chuyển</td>
                    </tr>
                    <tr>
                        <td className="py-1 font-semibold">Tổng Cộng</td>
                        <td className="py-1 text-right font-bold text-red-600">{total.toLocaleString("vi-VN")} đ</td>
                    </tr>
                </tbody>
            </table>
            <button className="w-full bg-red-600 text-white py-3 rounded font-semibold mb-3 hover:bg-red-700 transition"
                onClick={() => {
                    handleNext();
                }}>
                Tiến hành thanh toán
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={() => {
                    selectAll();
                }}>
                Chọn tât cả
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={() => {
                    deselectAll();
                }}>
                Bỏ chọn tât cả
            </button>
            <button className="w-full border border-gray-400 text-gray-700 py-3 rounded font-semibold hover:bg-gray-100 transition"
                onClick={() => {
                    clearCart();
                }}>
                Xóa giỏ hàng
            </button>
        </div>
    );
};

export default CartSummary;
