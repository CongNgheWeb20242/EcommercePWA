import React, { useState } from "react";
import { SearchProductsParams } from "@/services/api/productService";
import { useProductStore } from "@/store/useProductStore";

const COLORS = [
    { name: "Black", class: "bg-black" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Brown", class: "bg-yellow-900" },
    { name: "Green", class: "bg-green-500" },
    { name: "Grey", class: "bg-gray-400" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "White", class: "bg-white border" },
    { name: "Yellow", class: "bg-yellow-400" },
];

interface SidebarFilterProps {
    show: boolean;
    onClose: () => void;
}

export default function SidebarFilter({ show, onClose }: SidebarFilterProps) {
    // Lấy hàm fetchProducts từ store
    const { fetchProducts } = useProductStore();

    // State tạm cho filter (có thể chuyển sang Zustand/global nếu muốn đồng bộ nhiều nơi)
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [priceMin, setPriceMin] = useState("");
    const [priceMax, setPriceMax] = useState("");
    const [rating, setRating] = useState("");
    const [brand, setBrand] = useState<string[]>([]);
    const [color, setColor] = useState<string[]>([]);
    const [inStock, setInStock] = useState(false);

    // Xử lý chọn brand multi
    const handleBrandChange = (b: string) => {
        setBrand((prev) =>
            prev.includes(b) ? prev.filter((v) => v !== b) : [...prev, b]
        );
    };

    // Xử lý chọn màu multi
    const handleColorChange = (c: string) => {
        setColor((prev) =>
            prev.includes(c) ? prev.filter((v) => v !== c) : [...prev, c]
        );
    };

    // Khi submit filter
    const handleApplyFilter = () => {
        const params: SearchProductsParams = {
            query: query || undefined,
            category: category || undefined,
            price:
                priceMin || priceMax
                    ? `${priceMin || 0}-${priceMax || 9999999}`
                    : undefined,
            rating: rating ? Number(rating) : undefined,
            page: 1,
            pageSize: 12,
        };
        fetchProducts(params);
    };

    const SIDEBAR_WIDTH = 280;

    return (
        <aside
            className={`
                h-screen bg-white border-r overflow-y-auto
                sticky top-0
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
                        <option value="men">Giày Nam</option>
                        <option value="women">Giày Nữ</option>
                        <option value="kids">Trẻ em</option>
                        {/* Nên lấy danh mục động từ API */}
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
                    <div className="flex flex-col gap-1">
                        {["Nike", "Adidas", "Puma", "Converse"].map((b) => (
                            <label key={b} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={brand.includes(b)}
                                    onChange={() => handleBrandChange(b)}
                                />
                                {b}
                            </label>
                        ))}
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
                                className={`w-6 h-6 rounded-full border cursor-pointer ${c.class} ${color.includes(c.name) ? "ring-2 ring-blue-500" : ""
                                    }`}
                                onClick={() => handleColorChange(c.name)}
                            />
                        ))}
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
