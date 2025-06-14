import React from "react";
import { Product } from "@/types/Product";
import { useNavigate } from "react-router-dom";
import CustomImage from "../ui/image";
import { renderStars } from "@/helper/StarGenerate";

interface CardProps {
    product: Product;
    highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ product }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/user/product/${product._id}`);
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition" onClick={handleCardClick}>
            <div className="relative w-full h-80 overflow-hidden bg-gray-200 rounded">
                {/* Image */}
                <CustomImage
                    src={product.image}
                    alt={product.name}
                    className={'w-full h-full object-cover'}
                    onLoad={() => { }}
                    onError={() => {
                        { };
                        { };
                    }}
                />
            </div>
            <div className="p-4">
                <span className="text-orange-600 font-semibold text-sm">
                    {product.brand}
                </span>
                <h3 className="font-semibold mt-1">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                {/* Đánh giá */}
                <div className="flex items-center mt-2 mb-1">
                    {renderStars(product.averageRating)}
                    <span className="ml-2 text-sm text-gray-500">
                        {product.averageRating} ({product.reviews.length} đánh giá)
                    </span>
                </div>
                <p className="font-bold mt-2">
                    <span className="text-red-600 font-bold text-md">
                        {product.price.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        })}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Card;
