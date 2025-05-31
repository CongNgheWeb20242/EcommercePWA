import React, { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "@/services/api/productService";
import ProductInfo from "@/components/user/ProductInfo";
import ShopInfo from "@/components/user/ShopInfo";
import ProductReviews from "@/components/user/ProductReviews";
import SuggestProductsSidebar from "@/components/user/SuggestProduct";
import ProductImages from "@/components/user/ProductImages";

const ProductPage: React.FC = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-16">
            <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <div className="text-lg text-gray-600 font-medium">Đang tải sản phẩm...</div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-16 min-h-[50vh]">
            <svg className="h-10 w-10 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-.01-8a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
            <div className="text-lg text-red-600 font-semibold">Đã xảy ra lỗi</div>
            <div className="text-gray-500 mt-2">{error}</div>
            <button
                onClick={() => { }}
                className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            >
                Thử lại
            </button>
        </div>
    );

    if (!product) return (
        <div className="flex flex-col items-center justify-center py-16 min-h-[50vh]">
            <svg className="h-10 w-10 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
            </svg>
            <div className="text-lg text-gray-500 font-medium">Không tìm thấy dữ liệu sản phẩm</div>
            <button
                onClick={() => navigate("/user/products")}
                className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
                Quay lại
            </button>
        </div>
    );


    return (
        <div className="bg-gray-100 px-2 sm:px-4 md:px-10 lg:px-[20%] py-4 md:py-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 md:p-10 md:pl-6 flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Left: Images */}
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <ProductImages product={product} />
                </div>
                {/* Right: Product Info */}
                <div className="w-full md:w-1/2">
                    <ProductInfo product={product} />
                </div>
            </div>

            <div className="mt-6">
                <ShopInfo />
            </div>

            <div className="flex flex-col lg:flex-row gap-4 mt-4">
                <div className="flex-1">
                    <ProductReviews product={product} />
                </div>
                <div className="w-full lg:w-[340px] flex-shrink-0">
                    <SuggestProductsSidebar categoryId={product.category._id} productId={product._id} />
                </div>
            </div>
        </div>

    );
}

export default ProductPage;
