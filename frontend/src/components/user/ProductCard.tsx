import React, { useState } from "react";
import { Product } from "@/types/Product";

interface CardProps {
    product: Product;
    highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ product }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition">
            <div className="relative w-full h-80 overflow-hidden bg-gray-200 rounded">
                {/* Skeleton shimmer loader */}
                {!imageLoaded && !imageError && (
                    <div
                        className="absolute inset-0 animate-shimmer"
                        style={{
                            background:
                                "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.4) 50%, transparent 100%)",
                            backgroundSize: "200% 100%",
                        }}
                    />
                )}

                {/* Error Placeholder */}
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Không thể tải ảnh</span>
                    </div>
                )}

                {/* Actual Image */}
                <img
                    src={`https://picsum.photos/300/300?random=${product._id}`}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageLoaded(true);
                        setImageError(true);
                    }}
                />
            </div>
            <div className="p-4">
                {/* Skeleton loader for text */}
                {!imageLoaded && !imageError ? (
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-shimmer"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 animate-shimmer"></div>
                        <div className="h-3 bg-gray-200 rounded w-full animate-shimmer"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/3 animate-shimmer"></div>
                    </div>
                ) : (
                    <>
                        <span className="text-orange-600 font-semibold text-sm">
                            {product.brand}
                        </span>
                        <h3 className="font-semibold mt-1">{product.name}</h3>
                        <p className="text-gray-500 text-sm">{product.description}</p>
                        <p className="font-bold mt-2">{product.price}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Card;
