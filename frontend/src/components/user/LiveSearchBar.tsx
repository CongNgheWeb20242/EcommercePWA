import { useProductSearchStore } from "@/store/useProductSearchStore";
import React, { useEffect, useRef, useState } from "react";
import SearchItem from "./SearchItem";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/Product";

export default function LiveSearchBar() {
    const navigate = useNavigate();

    const [showResults, setShowResults] = useState(false);

    const [query, setQuery] = useState("");
    const { products, loading, fetchProducts } = useProductSearchStore();
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                handleClearSearch();
            }
        };
        if (showResults) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showResults]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!query) {
            setShowResults(false);
            return;
        }

        debounceRef.current = setTimeout(() => {
            fetchProducts({ query: query, page: 1, pageSize: 10 });
            setShowResults(true);
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, fetchProducts]);

    const handleProductClick = (product: Product) => {
        navigate(`/user/product/${product._id}`);
    };

    const handleClearSearch = () => {
        setShowResults(false);
        setQuery("");
    };

    return (
        <div className="relative w-80" ref={dropdownRef}>
            {/* Ô tìm kiếm */}
            <div className="flex items-center border rounded px-2 py-1 bg-white">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="flex-1 outline-none border-none bg-transparent px-1 py-2"
                />
                {showResults ? (
                    <button
                        className="w-5 h-5 text-gray-400 cursor-pointer"
                        onClick={handleClearSearch}
                    >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" strokeWidth="2"></circle>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-2-2"></path>
                    </svg>
                )}
            </div>

            {/* Kết quả tìm kiếm */}
            {query && showResults && (
                <div className="absolute left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white border rounded shadow z-10">
                    {loading ? (
                        <div className="p-4 text-gray-500 text-center">Đang tìm kiếm...</div>
                    ) : products.length === 0 ? (
                        <div className="p-4 text-gray-500 text-center">Không tìm thấy sản phẩm</div>
                    ) : (
                        products.map(product => (
                            <SearchItem
                                key={product._id}
                                product={product}
                                onClick={handleProductClick}
                            />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
