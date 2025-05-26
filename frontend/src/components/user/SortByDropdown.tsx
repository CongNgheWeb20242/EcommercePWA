import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { SearchProductsParams } from "@/types/SearchProductsParams";
import { useProductStore } from "@/store/useProductStore";
import { SORT_OPTIONS, SortType } from "@/types/SortType";

export default function SortByDropdown() {
    const { fetchProducts } = useProductStore();

    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState<SortType | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleSelect = (value: string) => {

        setOrder(value as SortType);
        const params: SearchProductsParams = {
            order: order!,
            page: 1,
        };
        fetchProducts(params);
        setOpen(false);
    };

    const selectedLabel =
        SORT_OPTIONS.find((opt) => opt.value === order)?.label || "Sắp xếp";

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center gap-2 border px-3 py-1 rounded hover:bg-gray-100"
                onClick={() => setOpen((v) => !v)}
                type="button"
            >
                {selectedLabel}
                <FontAwesomeIcon icon={faChevronDown} className="text-base" />
            </button>
            {open && (
                <ul className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-lg z-10">
                    {SORT_OPTIONS.map((opt) => (
                        <li key={opt.value}>
                            <button
                                className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${order === opt.value ? "font-semibold text-blue-600" : ""
                                    }`}
                                onClick={() => handleSelect(opt.value)}
                                type="button"
                            >
                                {opt.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
