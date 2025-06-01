import React from "react";
import useCartStore from "@/store/useCartStore";
import type { CartItem } from "@/types/CartItem";
import CustomImage from "../ui/image";

interface CartItemProps {
  item: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeItem, selectItem, increaseQuantity, decreaseQuantity } = useCartStore();

  return (
    <div
      className={`flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border-b transition-colors ${item.selected ? "border-l-4 border-blue-600 bg-blue-50" : "bg-white"
        }`}
    >
      {/* Ảnh sản phẩm */}
      <div className="w-full md:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <CustomImage
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
      </div>

      {/* Thông tin chính */}
      <div className="flex-1 w-full">
        <h3 className="text-lg font-semibold">{item.name}</h3>

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm md:text-base">
          <div className="col-span-2 md:col-span-1">
            <span className="text-gray-600">Size:</span>{" "}
            <span className="font-medium">{item.selectSize}</span>
          </div>

          <div className="col-span-2 md:col-span-1">
            <span className="text-gray-600">Màu:</span>{" "}
            <span className="font-medium">{item.selectColor}</span>
          </div>

          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Số lượng:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  onClick={() => decreaseQuantity(item._id, item.selectSize, item.selectColor)}
                >
                  -
                </button>
                <span className="px-3 min-w-[2rem] text-center">{item.quantity}</span>
                <button
                  className="px-3 py-1 hover:bg-gray-100 transition-colors"
                  onClick={() => increaseQuantity(item._id, item.selectSize, item.selectColor)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Giá */}
        <div className="mt-2 text-red-600 font-bold">
          {(item.price * item.quantity).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className="flex md:flex-col gap-2 self-end md:self-auto">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-100 transition-colors"
          title={item.selected ? "Bỏ chọn" : "Chọn sản phẩm"}
          onClick={() => selectItem(item._id, item.selectSize, item.selectColor, !item.selected)}
        >
          {item.selected ? (
            <span className="text-blue-600 text-xl">✓</span>
          ) : (
            <span className="text-gray-400 text-xl">○</span>
          )}
        </button>

        <button
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition-colors"
          title="Xóa sản phẩm"
          onClick={() => removeItem(item._id, item.selectSize, item.selectColor)}
        >
          <span className="text-red-600 text-xl">×</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
