import { useState } from "react";
import ReviewFilterBar from "./ReviewFilterBar";
import ReviewItem from "./ReviewItem";
import { Product } from "@/types/Product";

interface ProductReviewsProps {
    product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const [activeRating, setActiveRating] = useState<number | null>(null);

    // Lọc review theo rating
    const filteredReviews =
        activeRating === null
            ? product.reviews
            : product.reviews.filter((r) => r.rating === activeRating);

    return (
        <div className="bg-white flex-1 rounded shadow p-6 mx-auto">
            <h2 className="text-lg font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
            <ReviewFilterBar
                reviews={product.reviews}
                activeRating={activeRating}
                onFilter={setActiveRating}
            />
            <div>
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review, idx) => (
                        <ReviewItem key={review._id || idx} review={review} />
                    ))
                ) : (
                    <div className="text-gray-500 italic py-8 text-center">
                        Không có đánh giá phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
}
