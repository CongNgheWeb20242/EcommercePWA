import { renderStars } from "@/helper/StarGenerate";
import { Review } from "@/types/Review";

function formatCount(n: number): string | null {
    if (n === null) return null;
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.', ',') + "k";
    return n.toString();
}

function buildReviewFilters(reviews: Review[], activeRating: number | null = null) {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
        if (counts[r.rating] !== undefined) counts[r.rating]++;
    });

    const total = reviews.length;

    const filters = [
        {
            label: "Tất Cả",
            count: formatCount(total),
            active: activeRating === null,
            value: null as number | null,
        },
        ...[5, 4, 3, 2, 1].map(rating => ({
            label: `${rating} Sao`,
            count: formatCount(counts[rating]),
            active: activeRating === rating,
            value: rating,
        })),
    ];

    return filters;
}

interface ReviewFilterBarProps {
    reviews: Review[];
    activeRating: number | null;
    onFilter: (rating: number | null) => void;
}

export default function ReviewFilterBar({
    reviews,
    activeRating,
    onFilter,
}: ReviewFilterBarProps) {
    const REVIEW_FILTERS = buildReviewFilters(reviews, activeRating);

    // Tính trung bình rating
    const avgRating =
        reviews.length > 0
            ? (
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            ).toFixed(1)
            : "0.0";

    return (
        <div className="bg-red-50 rounded border border-red-100 p-6 mb-6">
            <div className="flex items-center gap-8 mb-3">
                <div className="flex flex-col items-center mr-8">
                    <span className="text-red-600 text-3xl font-bold leading-8">{avgRating}</span>
                    <span className="text-gray-600 text-sm">trên 5</span>
                    <span>{renderStars(Number(avgRating))}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {REVIEW_FILTERS.map((f) => (
                        <button
                            key={f.label}
                            className={`px-4 py-1 rounded border text-sm font-semibold transition
                                ${f.active ? "bg-red-500 text-white border-red-500" : "bg-white border-gray-300 text-gray-700"}
                            `}
                            onClick={() => onFilter(f.value)}
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