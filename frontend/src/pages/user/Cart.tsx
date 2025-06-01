import CartItem from "@/components/user/CartItem";
import CartSummary from "@/components/user/CartSummary";
import useCartStore from "@/store/useCartStore";
import useCheckoutStore from "@/store/useCheckOutStore";
import { useEffect } from "react";

const CartPage = () => {
    const { clearAll } = useCheckoutStore();
    const items = useCartStore(state => state.items);

    useEffect(() => {
        clearAll();
    }, []);

    return (
        <div className="bg-white min-h-screen py-6 px-2 sm:px-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-6 text-center sm:text-left">Giỏ Hàng</h1>
            <div className="flex flex-col-reverse lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
                {/* Danh sách sản phẩm */}
                <div className="flex-1 w-full max-w-full">
                    <div className="bg-white border rounded-lg p-4 sm:p-6 flex flex-col gap-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">Giỏ hàng trống</div>
                        ) : (
                            items.map(item => (
                                <CartItem key={item._id + "_" + item.selectSize + "_" + item.selectColor} item={item} />
                            ))
                        )}
                    </div>
                </div>
                {/* Tổng kết đơn hàng */}
                <div className="w-full lg:w-[380px] flex-shrink-0">
                    <CartSummary />
                </div>
            </div>
        </div>
    );
};

export default CartPage;
