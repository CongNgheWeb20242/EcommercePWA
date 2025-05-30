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
        <div className="bg-white min-h-screen py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Giỏ Hàng</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Danh sách sản phẩm */}
                <div className="flex-1">
                    <div className="bg-white border rounded-lg p-6 flex flex-col gap-4">
                        {items.length === 0 ? (
                            <div className="text-gray-500 text-center py-8">Giỏ hàng trống</div>
                        ) : (
                            items.map(item => <CartItem key={item._id + "_" + item.selectSize} item={item} />)
                        )}
                    </div>
                </div>
                {/* Tổng kết đơn hàng */}
                <CartSummary />
            </div>
        </div>
    );
};

export default CartPage;