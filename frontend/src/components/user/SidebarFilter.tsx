import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { SearchProductsParams } from "@/types/SearchProductsParams";
import { getCategories } from "@/services/api/productService";
import { Category } from "@/types/Category";

const COLORS = [
    { name: "black", class: "bg-black" },
    { name: "blue", class: "bg-blue-500" },
    { name: "brown", class: "bg-yellow-900" },
    { name: "green", class: "bg-green-500" },
    { name: "grey", class: "bg-gray-400" },
    { name: "purple", class: "bg-purple-500" },
    { name: "white", class: "bg-white border" },
    { name: "yellow", class: "bg-yellow-400" },
];

interface SidebarFilterProps {
    show: boolean;
    onClose: () => void;
    onSearchTextChange?: (text: string) => void;
}

export default function SidebarFilter({ show, onClose, onSearchTextChange }: SidebarFilterProps) {
    const { fetchProducts } = useProductStore();

    const [categories, setCategories] = useState<Category[]>([]);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [rating, setRating] = useState("");
    const [brand, setBrand] = useState("");
    const [color, setColor] = useState("");
    const [inStock, setInStock] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    // Xử lý chọn brand 
    const handleBrandChange = (b: string) => {
        setBrand(b);
    };

    // Xử lý chọn màu 
    const handleColorChange = (c: string) => {
        setColor(c);
    };

    // Khi submit filter
    const handleApplyFilter = () => {
        onSearchTextChange?.(query);
        const params: SearchProductsParams = {
            query: query || undefined,
            category: category || undefined,
            brand: brand || undefined,
            color: color || undefined,
            price:
                priceMin || priceMax
                    ? `${priceMin || 0}-${priceMax || 9999999}`
                    : undefined,
            rating: rating ? Number(rating) : undefined,
            page: 1,
        };
        fetchProducts(params);
    };

    const SIDEBAR_WIDTH = 280;

    return (
        <aside
            className={`
                h-[90vh] bg-white border-r overflow-y-auto
                sticky top-20
                transition-all duration-300
            `}
            style={{
                width: show ? SIDEBAR_WIDTH : 0,
                minWidth: show ? SIDEBAR_WIDTH : 0,
                opacity: show ? 1 : 0,
                pointerEvents: show ? "auto" : "none",
            }}
        >
            <div className="p-6 border-b flex items-center justify-between">
                <span className="font-bold text-lg">Bộ lọc</span>
                <button
                    className="text-2xl font-bold"
                    onClick={onClose}
                    aria-label="Đóng bộ lọc"
                >
                    &times;
                </button>
            </div>
            <div className="p-6 space-y-6">
                {/* Từ khóa */}
                <div>
                    <div className="font-semibold mb-2">Tìm kiếm</div>
                    <input
                        type="text"
                        placeholder="Tên sản phẩm..."
                        className="w-full border rounded px-2 py-1"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                {/* Danh mục */}
                <div>
                    <div className="font-semibold mb-2">Danh mục</div>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        {categories.length > 0 && categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                        {/*  */}
                    </select>
                </div>
                {/* Giá */}
                <div>
                    <div className="font-semibold mb-2">Khoảng giá</div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Từ"
                            className="w-1/2 border rounded px-2 py-1"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Đến"
                            className="w-1/2 border rounded px-2 py-1"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                        />
                    </div>
                </div>
                {/* Đánh giá */}
                <div>
                    <div className="font-semibold mb-2">Đánh giá</div>
                    <select
                        className="w-full border rounded px-2 py-1"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        <option value="4">Từ 4 sao</option>
                        <option value="3">Từ 3 sao</option>
                        <option value="2">Từ 2 sao</option>
                        <option value="1">Từ 1 sao</option>
                    </select>
                </div>
                {/* Thương hiệu */}
                <div>
                    <div className="font-semibold mb-2">Thương hiệu</div>
                    <div className="flex gap-2 flex-wrap">
                        {["Nike", "Adidas", "Puma", "Converse"].map((b) => (
                            <label key={b} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={brand === b}
                                    onChange={() => handleBrandChange(b)}
                                />
                                {b}
                            </label>
                        ))}
                        <label key={"nullBrand"} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="brand"
                                checked={brand === ""}
                                onChange={() => handleBrandChange("")}
                            />
                            {"Bỏ chọn"}
                        </label>
                    </div>
                </div>
                {/* Màu sắc */}
                <div>
                    <div className="font-semibold mb-2">Màu sắc</div>
                    <div className="flex gap-2 flex-wrap">
                        {COLORS.map((c) => (
                            <span
                                key={c.name}
                                title={c.name}
                                className={`w-6 h-6 rounded-full border cursor-pointer ${c.class} ${color === c.name ? "ring-2 ring-blue-500" : ""
                                    }`}
                                onClick={() => handleColorChange(c.name)}
                            />
                        ))}

                        <span
                            key={"nullColor"}
                            title={"nullColor"}
                            className={`w-6 h-6 rounded-full border cursor-pointer ${color === "" ? "ring-2 ring-blue-500" : ""
                                }`}
                            onClick={() => handleColorChange("")}
                        />
                    </div>
                </div>
                {/* Còn hàng */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={inStock}
                            onChange={() => setInStock((v) => !v)}
                        />
                        <span>Chỉ hiện sản phẩm còn hàng</span>
                    </label>
                </div>
                {/* Nút áp dụng filter */}
                <div>
                    <button
                        type="button"
                        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                        onClick={handleApplyFilter}
                    >
                        Áp dụng bộ lọc
                    </button>
                </div>
            </div>
        </aside>
    );
}
