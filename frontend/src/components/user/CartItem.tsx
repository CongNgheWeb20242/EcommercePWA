import React from "react";
import useCartStore from "@/store/useCartStore";
import type { CartItem } from "@/types/CartItem";
import CustomImage from "../ui/image";


interface CartItemProps {
  item: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const removeItem = useCartStore(state => state.removeItem);
  const selectItem = useCartStore(state => state.selectItem);
  const increaseQuantity = useCartStore(state => state.increaseQuantity);
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity);

  return (
    <div
      className={
        `flex items-center gap-6 border transition-colors ` +
        (item.selected ? 'border-2 border-blue-600' : 'border-b')
      }
    >      {/* Ảnh sản phẩm */}
      <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded">
        <CustomImage
          src={item._id} //TODO
          alt={item.name}
          className="object-contain w-24 h-24"
        />
      </div>
      {/* Thông tin sản phẩm */}
      <div className="flex-1">
        <div className="font-semibold">{item.name}</div>
        <div className="text-gray-700 mt-2">
          Số Lượng:
          <button
            className="mx-2 px-2 py-1 border rounded"
            onClick={() => decreaseQuantity(item._id)}
          >-</button>
          <span className="font-semibold">{item.quantity}</span>
          <button
            className="mx-2 px-2 py-1 border rounded"
            onClick={() => increaseQuantity(item._id)}
          >+</button>
        </div>
        <div className="text-gray-700">Size: <span className="font-semibold">{item.size}</span></div>
        <div className="text-red-600 font-bold text-lg mt-2">
          {(item.price * item.quantity).toLocaleString("vi-VN")} đ
        </div>
      </div>
      {/* Nút xóa hoặc chọn*/}
      <div className="flex gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-100 transition"
          title="Chọn sản phẩm"
          onClick={() => selectItem(item._id, !(item.selected))}
        >
          <span className="text-xl font-bold">
            {item.selected ? "-" : "+"}
          </span>
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition"
          title="Xóa sản phẩm"
          onClick={() => removeItem(item._id)}
        >
          <span className="text-xl font-bold">&times;</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
