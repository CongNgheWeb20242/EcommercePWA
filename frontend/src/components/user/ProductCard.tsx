import React, { useState } from "react";
import { Product } from "@/types/Product";
import { useNavigate } from "react-router-dom";
import CustomImage from "../ui/image";

interface CardProps {
    product: Product;
    highlight?: boolean;
}

const Card: React.FC<CardProps> = ({ product }) => {
    const navigate = useNavigate();

    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleCardClick = () => {
        navigate(`/user/product/${product._id}`);
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition" onClick={handleCardClick}>
            <div className="relative w-full h-80 overflow-hidden bg-gray-200 rounded">
                {/* Image */}
                <CustomImage
                    src={`https://picsum.photos/300/300?random=${product._id}`} //TODO
                    alt={product.name}
                    className={'w-full h-full object-cover'}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => {
                        setImageLoaded(true);
                        setImageError(true);
                    }}
                />
            </div>
            <div className="p-4">
                <span className="text-orange-600 font-semibold text-sm">
                    {product.brand}
                </span>
                <h3 className="font-semibold mt-1">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
                <p className="font-bold mt-2">{product.price}</p>
            </div>
        </div>
    );
};

export default Card;
