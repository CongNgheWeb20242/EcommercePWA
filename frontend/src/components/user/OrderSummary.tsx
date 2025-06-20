import { useCartStore } from "@/store/useCartStore";
import OrderedProductList from "./OrderedProductList";

export default function OrderSummary() {
    const { totalItems, totalPrice } = useCartStore();

    return (
        <div className="w-full max-w-full md:max-w-xs bg-blue-50 p-4 sm:p-6 rounded border mx-auto">
            <div className="font-semibold text-base sm:text-lg mb-4 text-center sm:text-left">
                TỔNG CỘNG | {totalItems} SẢN PHẨM
            </div>
            <table className="w-full text-sm mb-4 border rounded overflow-hidden">
                <tbody>
                    <tr>
                        <td className="py-1 font-semibold border border-blue-100">Tạm tính</td>
                        <td className="py-1 text-right font-semibold border border-blue-100">
                            <span className="text-red-600 font-bold text-md">
                                {totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 border border-blue-100">Phí Vận Chuyển</td>
                        <td className="py-1 text-right border border-blue-100">
                            Miễn phí vận chuyển
                        </td>
                    </tr>
                    <tr>
                        <td className="py-1 font-semibold border border-blue-100">Tổng Cộng</td>
                        <td className="py-1 text-right font-bold text-red-600 border border-blue-100">
                            <span className="text-red-600 font-bold text-md">
                                {totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="font-semibold mb-2 text-center sm:text-left">SẢN PHẨM ĐÃ ĐẶT HÀNG</div>
            <OrderedProductList />
        </div>
    );
}
