// components/product/ProductImages.tsx
import { Product } from "@/types/Product";
import CustomImage from "../ui/image";
import React, { useEffect } from "react";
import useCartStore from "@/store/useCartStore";


export default function ProductImages({ product }: { product: Product }) {
    const productImageRef = React.useRef<HTMLDivElement>(null);

    const setproductImageRef = useCartStore((state) => state.setproductImageRef);

    useEffect(() => {
        if (productImageRef.current) {
            setproductImageRef(productImageRef);
        }
    }, []);

    return (
        <div className="flex flex-col items-center md:w-1/2">
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="w-full h-full relative" ref={productImageRef}>
                    <CustomImage
                        src={product._id} // TODO: Thay bằng URL hình ảnh thực tế
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onLoad={() => { }}
                        onError={() => { }}
                    />
                </div>

                {/* Thumbnails */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                    <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                    <CustomImage src={product._id} alt="" className="w-10 h-10 rounded border" /> {/* TODO */}
                </div>
            </div>
        </div>
    );
}
