import React, { useEffect, useState } from "react";
import CustomImage from "../../components/ui/image";
import { Product } from "@/types/Product";
import { useParams } from "react-router-dom";
import { getProductById } from "@/services/api/productService";
import useCartStore from "@/store/useCartStore";

const sizes = [39, 40, 41, 42, 43, 44, 45]; //TODO: Lấy từ API

const ProductPage: React.FC = () => {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedSize, setSelectedSize] = useState(40);
    const [quantity, setQuantity] = useState(1);

    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                if (!id) throw new Error("Không tìm thấy sản phẩm");
                const data = await getProductById(id);
                setProduct(data);
            } catch (err: any) {
                setError(err.message || "Có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    if (loading) return <div>Đang tải sản phẩm...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Không có dữ liệu sản phẩm</div>;

    return (
        <div className="bg-white px-[10%] py-[2%]">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400 mb-[2%]">
                Trang Chủ / Giày Nam / Giày Chạy Bộ Nam On Cloudstratus 3 - Xanh Navy
            </div>
            <div className="flex flex-col md:flex-row gap-8 h-[100%]">
                {/* Left: Images */}
                <div className="flex flex-col items-center md:w-1/2">
                    <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <CustomImage
                            src={product._id} //TODO
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onLoad={() => { }}
                            onError={() => { }}
                        />
                        {/* Thumbnails absolute ở góc trên trái */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                            <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                            <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                        </div>
                    </div>
                </div>
                {/* Right: Product Info */}
                <div className="md:w-1/2">
                    <h1 className="text-4xl font-bold mb-2">
                        {product.name}
                    </h1>
                    <div className="text-red-600 text-xl font-bold mb-4">
                        {product.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded mb-4 font-semibold">
                        HƯỚNG DẪN CHỌN SIZE
                    </button>
                    <div className="mb-4">
                        <div className="font-semibold mb-2">Kích Cỡ: {selectedSize}</div>
                        <div className="flex gap-2 mb-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`px-3 py-1 rounded border ${selectedSize === size
                                        ? "bg-gray-900 text-white border-gray-900"
                                        : "bg-white text-gray-900 border-gray-300"
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-8 text-center border rounded"
                        />
                        <button
                            className="px-2 py-1 border rounded"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-3 rounded font-semibold mb-6"
                        onClick={() => addItem(product, selectedSize, quantity)}>
                        Thêm Vào Giỏ Hàng
                    </button>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="border rounded-lg p-3">
                            <div className="font-semibold">Miễn phí vận chuyển</div>
                            <div>Cho đơn hàng từ 800k</div>
                        </div>
                        <div className="border rounded-lg p-3">
                            <div className="font-semibold">Bảo hành 6 tháng</div>
                            <div>15 ngày đổi trả</div>
                        </div>
                        <div className="border rounded-lg p-3">
                            <div className="font-semibold">Thanh toán COD</div>
                            <div>Yên tâm mua sắm</div>
                        </div>
                        <div className="border rounded-lg p-3">
                            <div className="font-semibold">Hotline: 0866550286</div>
                            <div>Hỗ trợ bạn 24/7</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPage;
