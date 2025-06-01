import { useState } from "react";
import ReviewFilterBar from "./ReviewFilterBar";
import ReviewItem from "./ReviewItem";
import { Product } from "@/types/Product";
import { userStore } from "@/store/userStore";
import { addReview } from "@/services/api/productService";
import { Review } from "@/types/Review";

interface ProductReviewsProps {
    product: Product;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const [activeRating, setActiveRating] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [localReviews, setLocalReviews] = useState(product.reviews);

    const user = userStore(state => state.user);

    // Lọc review theo rating
    const filteredReviews =
        activeRating === null
            ? localReviews
            : localReviews.filter((r) => r.rating === activeRating);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!user) {
            setError("Bạn cần đăng nhập để đánh giá sản phẩm.");
            return;
        }
        if (!comment.trim()) {
            setError("Vui lòng nhập nội dung đánh giá.");
            return;
        }
        if (rating < 1 || rating > 5) {
            setError("Vui lòng chọn số sao.");
            return;
        }

        setSubmitting(true);
        const body = {
            rating: rating,
            comment: comment
        }
        const success = await addReview(body, product._id);
        if (success) {
            const newReview: Review = {
                _id: "",
                rating: rating,
                userId: user._id,
                productId: product._id,
                comment: comment,
            }
            setLocalReviews([newReview, ...localReviews]);
            setComment("");
            setRating(0);
            setSuccess("Đánh giá của bạn đã được gửi thành công!");
        }

        else {
            setError("Có lỗi xảy ra, vui lòng thử lại.");
        }
        setSubmitting(false);
    };

    return (
        <div className="bg-white flex-1 rounded shadow p-6 mx-auto">
            <h2 className="text-lg font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
            <ReviewFilterBar
                reviews={localReviews}
                activeRating={activeRating}
                onFilter={setActiveRating}
            />

            {/* Form đánh giá */}
            <div className="mb-6 border-b pb-6">
                <h3 className="font-semibold mb-2">Viết đánh giá của bạn</h3>
                {!user && (
                    <div className="text-red-500 text-sm mb-2">
                        Vui lòng đăng nhập để bình luận và đánh giá sản phẩm.
                    </div>
                )}
                {error && (
                    <div className="text-red-500 text-sm mb-2">{error}</div>
                )}
                {success && (
                    <div className="text-green-600 text-sm mb-2">{success}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="mr-2 text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} focus:outline-none`}
                                onClick={() => setRating(star)}
                                disabled={submitting || !user}
                                aria-label={`Chọn ${star} sao`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <textarea
                        className="w-full border rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Nhập nhận xét về sản phẩm..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        disabled={submitting || !user}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={submitting || !user}
                    >
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                    </button>
                </form>
            </div>

            {/* Danh sách đánh giá */}
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
