import { Product } from "@/types/Product";
import CustomImage from "../ui/image";
import React, { useEffect, useState } from "react";
import useCartStore from "@/store/useCartStore";
import FitImage from "../ui/fitImage";


export default function ProductImages({ product }: { product: Product }) {
    const productImageRef = React.useRef<HTMLDivElement>(null);
    const [selectedImage, setSelectedImage] = useState(product.image);
    const setproductImageRef = useCartStore((state) => state.setproductImageRef);

    useEffect(() => {
        if (productImageRef.current) {
            setproductImageRef(productImageRef);
        }
    }, []);

    const handleThumbnailClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="w-full aspect-square lg:aspect-[3/4] relative" ref={productImageRef}>
                    {/* Main images */}
                    <FitImage
                        src={selectedImage}
                        alt={product.name}
                        className="w-full h-full"
                        onLoad={() => { }}
                        onError={() => { }}
                    />
                </div>

                {/* Images */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {/* Thêm ảnh chính vào đầu danh sách */}
                    {[product.image, ...(product.images || [])].map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(image)}
                            className={`border-2 rounded transition-all ${selectedImage === image
                                ? 'border-red-500 opacity-100'
                                : 'border-gray-200 opacity-70 hover:opacity-100'
                                }`}
                        >
                            <CustomImage
                                src={image}
                                alt=""
                                className="w-10 h-10 object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
