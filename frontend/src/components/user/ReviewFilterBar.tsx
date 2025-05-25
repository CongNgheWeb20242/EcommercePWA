import { renderStars } from "@/helper/StarGenerate";

//TODO: Xoá hàm này khi có dữ liệu thực
const REVIEW_FILTERS = [
    { label: "Tất Cả", count: null, active: true },
    { label: "5 Sao", count: "6,9k" },
    { label: "4 Sao", count: "473" },
    { label: "3 Sao", count: "120" },
    { label: "2 Sao", count: "40" },
    { label: "1 Sao", count: "77" },
];


export default function ReviewFilterBar() {
    return (
        <div className="bg-red-50 rounded border border-red-100 p-6 mb-6">
            <div className="flex items-center gap-8 mb-3">
                <div className="flex flex-col items-center mr-8">
                    <span className="text-red-600 text-3xl font-bold leading-8">4.8</span>
                    <span className="text-gray-600 text-sm">trên 5</span>
                    <span>
                        {renderStars(4.8)}
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {REVIEW_FILTERS.map((f) => (
                        <button
                            key={f.label}
                            className={`px-4 py-1 rounded border text-sm font-semibold transition
                ${f.active ? "bg-red-500 text-white border-red-500" : "bg-white border-gray-300 text-gray-700"}
              `}
                        >
                            {f.label}
                            {f.count && <span className="ml-1 text-xs text-gray-500">({f.count})</span>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}