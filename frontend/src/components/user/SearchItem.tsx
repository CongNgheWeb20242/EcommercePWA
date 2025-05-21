import React from "react";
import { Product } from "@/types/Product";
import CustomImage from "../ui/image";

interface SearchItemProps {
    product: Product;
    onClick?: (product: Product) => void;
}

const SearchItem: React.FC<SearchItemProps> = ({ product, onClick }) => {
    const handleClick = () => {
        if (onClick) onClick(product);
    };

    return (
        <div
            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
            onClick={handleClick}
        >
            <CustomImage
                src={product._id} //TODO
                alt={product.name}
                className="w-10 h-10 object-cover rounded mr-3"
            />
            <div className="flex-1 truncate">
                <div className="font-medium text-sm truncate">{product.name}</div>
                <div className="text-sm text-gray-600 font-semibold">
                    {product.price.toLocaleString("vi-VN")} đ
                </div>
            </div>
        </div>
    );
};

export default SearchItem;
