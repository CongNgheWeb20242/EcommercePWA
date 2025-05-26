import { searchProducts } from "@/services/api/productService";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
import CustomImage from "../ui/image";
import { useNavigate } from "react-router-dom";

interface SuggestProductsSidebarProps {
    categoryId: string;
    productId: string;
}


export default function SuggestProductsSidebar({ categoryId, productId }: SuggestProductsSidebarProps) {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await searchProducts({ category: categoryId, page: 1, pageSize: 5 });
            setProducts(res?.products || []);
        };
        fetchProducts();
    }, []);


    return (
        <div className="bg-white p-3 rounded shadow-sm w-64">
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Sản Phẩm tương tự</h3>
            <div className="flex flex-col gap-6">
                {products
                    .filter((prod) => prod._id !== productId)
                    .map((prod) => (
                        <div key={prod._id} className="flex flex-col px-3 items-left pb-2 border-b-2 last:border-b-0 last:pb-0"
                            onClick={() => {
                                navigate(`/user/product/${prod._id}`);
                            }}>
                            <CustomImage
                                src={prod._id} //TODO
                                alt={prod.name}
                                className="object-cover rounded mb-2"
                            />
                            <div className="w-full text-[15px] font-medium text-gray-700 truncate">
                                {prod.name.length > 40 ? prod.name.slice(0, 40) + "..." : prod.name}
                            </div>
                            <div className="text-red-600 font-semibold mt-1 text-base">
                                <span className="text-red-600 font-bold text-md">
                                    {prod.price.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
