import { useState } from "react";
import { Product } from "@/types/Product";
import { renderStars } from "@/helper/StarGenerate";
import useCartStore from "@/store/useCartStore";
import sizeTableImg from '../../assets/common/size_table.jpg';
import FlyImage from "./FlyImage";

interface FlyImageState {
    src: string;
    start: { x: number; y: number; w: number; h: number };
    end: { x: number; y: number; w: number; h: number };
}

export default function ProductInfo({ product }: { product: Product }) {
    const addItem = useCartStore(state => state.addItem);

    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showSizeTable, setShowSizeTable] = useState(false);

    const [flyImage, setFlyImage] = useState<FlyImageState | null>(null);

    const { cartIconRefDesktop, cartIconRefMobile, productImageRef } = useCartStore();
    const [errorMessage, setErrorMessage] = useState("");

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            setErrorMessage("Vui lòng chọn size và màu sắc trước khi thêm vào giỏ hàng");
            return;
        }

        addItem(product, selectedSize, selectedColor, quantity);
        setErrorMessage("");

        // Chọn đúng ref theo thiết bị
        const cartIconRef = window.innerWidth < 768 ? cartIconRefMobile : cartIconRefDesktop;

        if (!productImageRef.current || !cartIconRef.current) {
            console.log("productImageRef or cartIconRef is null");
            return;
        }

        const imgRect = productImageRef.current.getBoundingClientRect();
        const cartRect = cartIconRef.current.getBoundingClientRect();
        setFlyImage({
            src: product.image,
            start: { x: imgRect.left, y: imgRect.top, w: imgRect.width, h: imgRect.height },
            end: { x: cartRect.left, y: cartRect.top, w: cartRect.width, h: cartRect.height },
        });
    };


    return (
        <div >
            {/* Bảng hướng dẫn chọn size */}
            {showSizeTable && (
                <div style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-lg p-5 relative max-w-[90vw] max-h-[80vh]">
                        <button
                            className="absolute top-0 right-0 text-gray-500 hover:text-black text-4xl w-12 h-12 flex items-center justify-center"
                            onClick={() => setShowSizeTable(false)}
                            aria-label="Đóng"
                            style={{ lineHeight: 1 }}
                        >
                            &times;
                        </button>
                        <img
                            src={sizeTableImg}
                            alt="Bảng hướng dẫn chọn size"
                            className="max-w-full max-h-[70vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Hiệu úng thêm giỏ hàng */}
            {flyImage && (
                <FlyImage
                    src={flyImage.src}
                    start={flyImage.start}
                    end={flyImage.end}
                />
            )}

            {/* Tên, sao, số đánh giá */}
            <div className="mb-2 flex flex-row items-center justify-between gap-2 lg:flex-col lg:items-start lg:gap-0">
                {/* Tên sản phẩm */}
                <h1 className="text-lg font-bold lg:text-2xl xl:text-4xl mb-0 lg:mb-2">
                    {product.name}
                </h1>

                {/* Cụm sao và số đánh giá */}
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-base lg:text-xl lg:mb-2">
                    <span>
                        {Number(product.averageRating).toFixed(1)} {renderStars(product.averageRating)}
                    </span>
                    <span className="text-gray-600 text-base lg:text-xl ml-2 font-normal">
                        {product.reviews.length} Đánh Giá
                    </span>
                </div>
            </div>

            {/* Giá */}
            <div className="flex items-center gap-4 mb-2">
                <span className="text-red-600 font-bold text-xl sm:text-2xl">
                    {product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            </div>


            {/* Màu sắc */}
            <div className="mb-3">
                <div className="font-semibold mb-1">Màu Sắc</div>
                <div className="flex flex-wrap gap-2">
                    {product.color.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1 rounded border text-sm ${selectedColor === color ? "border-red-500 bg-red-50 font-bold" : "border-gray-300 bg-white"}`}
                        >
                            {color}
                        </button>
                    ))}
                </div>
            </div>

            {/* Size */}
            <div className="mb-3">
                <div className="font-semibold mb-1">Size</div>
                <div className="flex gap-2">
                    {product.size.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-1 rounded border ${selectedSize === size ? "border-red-500 bg-red-50 font-bold" : "border-gray-300 bg-white"}`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Số lượng */}
            <div className="mb-4">
                <div className="font-semibold mb-1">Số Lượng</div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                        disabled={quantity <= 1}
                    >-</button>
                    <span className="px-3">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-3 py-1 border border-gray-300 rounded"
                    >+</button>
                </div>
            </div>

            {/* Thông báo lỗi */}
            {errorMessage && (
                <div className="mb-3 w-full bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded text-sm text-center">
                    {errorMessage}
                </div>
            )}

            {/* Nút hành động */}
            <div className="flex gap-4 mt-6">
                <button className="flex-1 py-3 border border-red-500 text-red-500 font-semibold rounded hover:bg-red-50 transition"
                    onClick={() => setShowSizeTable(true)}
                >
                    HƯỚNG DẪN CHỌN SIZE
                </button>
                <button className="flex-1 py-3 bg-red-500 text-white font-bold rounded hover:bg-red-600 transition"
                    onClick={() => handleAddToCart()}>
                    Thêm Vào Giỏ Hàng
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 py-5">
                <div className="border rounded-lg p-3">
                    <div className="font-bold">Miễn phí vận chuyển</div>
                    <div>Cho đơn hàng từ 800k</div>
                </div>
                <div className="border rounded-lg p-3">
                    <div className="font-bold">Bảo hành 6 tháng</div>
                    <div>15 ngày đổi trả</div>
                </div>
                <div className="border rounded-lg p-3">
                    <div className="font-bold">Thanh toán COD</div>
                    <div>Yên tâm mua sắm</div>
                </div>
                <div className="border rounded-lg p-3">
                    <div className="font-bold">Hotline: 0866550286</div>
                    <div>Hỗ trợ bạn 24/7</div>
                </div>
            </div>
        </div>
    );
}
