import { useState } from "react";
import { Product } from "@/types/Product";
import { generateRandomRatingAndReviews, renderStars } from "@/helper/StarGenerate";
import useCartStore from "@/store/useCartStore";
import sizeTableImg from '../../assets/common/size_table.jpg';
import FlyImage from "./FlyImage";

// TDOD: Xoá hàm này khi có dữ liệu thực
const COLORS = [
    "Đen", "Be", "Đỏ", "Xanh navy", "Trắng", "Be nhạt", "Hồng baby"
];
const SIZES = ["S", "M"];

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

    // TODO: Xoá hàm này khi có dữ liệu thực
    const { rating, numReviews } = generateRandomRatingAndReviews();

    const { cartIconRef, productImageRef } = useCartStore();

    const handleAddToCart = () => {
        if (!productImageRef.current || !cartIconRef.current) return;

        const imgRect = productImageRef.current.getBoundingClientRect();
        const cartRect = cartIconRef.current.getBoundingClientRect();

        addItem(product, selectedSize, quantity)

        setFlyImage({
            src: product._id, // TODO: Thay bằng URL hình ảnh thực tế
            start: { x: imgRect.left, y: imgRect.top, w: imgRect.width, h: imgRect.height },
            end: { x: cartRect.left, y: cartRect.top, w: cartRect.width, h: cartRect.height },
        });

    };

    return (
        <div className="md:w-1/2">
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

            {/*Tên sản phẩm */}
            <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold mb-2">
                    {product.name}
                </h1>
            </div>

            {/* Đánh giá & số lượng đánh giá */}
            <div className="flex items-center gap-4 mb-4">
                <span className="flex items-center gap-1 text-yellow-500 font-bold text-xl">
                    {rating} {renderStars(rating)}
                </span>
                <span className="text-gray-600 text-xl">{numReviews} Đánh Giá</span>
            </div>

            {/* Giá */}
            <div className="flex items-center gap-4 mb-2">
                <span className="text-red-600 font-bold text-2xl">
                    {product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}
                </span>
            </div>

            {/* //TODO: Thêm nếu đủ tgian */}
            {/* Vận chuyển */}
            {/* <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FontAwesomeIcon icon={faTruck} />
                <span>Nhận từ <b>26 Th05 - 29 Th05</b>, phí giao ₫0</span>
                <span className="ml-2 text-xs text-red-500 cursor-pointer">Chi tiết</span>
            </div> */}


            {/* Màu sắc */}
            <div className="mb-3">
                <div className="font-semibold mb-1">Màu Sắc</div>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-1 rounded border ${selectedColor === color ? "border-red-500 bg-red-50 font-bold" : "border-gray-300 bg-white"}`}
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
                    {SIZES.map((size) => (
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
