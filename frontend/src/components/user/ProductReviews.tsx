import ReviewFilterBar from "./ReviewFilterBar";
import ReviewItem from "./ReviewItem";
import { Review } from "@/types/Review";


//TODO: Xoá hàm này khi có dữ liệu thực
const REVIEWS: Review[] = [
    {
        _id: "r1",
        rating: 5,
        userId: "6831bfc77faba2ce62e0d738",
        productId: "p1",
        comment: "Sản phẩm rất đẹp, giao hàng nhanh, shop tư vấn nhiệt tình.",
        createdAt: "2025-05-25T08:30:00.000Z",
    },
    {
        _id: "r2",
        rating: 4,
        userId: "6831bfc77faba2ce62e0d738",
        productId: "p2",
        comment: "Áo mặc vừa vặn, chất vải tốt, sẽ ủng hộ lần sau.",
        createdAt: "2025-05-24T14:10:00.000Z",
    },
    {
        _id: "r3",
        rating: 5,
        userId: "6831bfc77faba2ce62e0d738",
        productId: "p3",
        comment: "Đóng gói cẩn thận, sản phẩm giống mô tả, rất hài lòng.",
        createdAt: "2025-05-23T09:45:00.000Z",
    },
    {
        _id: "r4",
        rating: 3,
        userId: "6831bfc77faba2ce62e0d738",
        productId: "p4",
        comment: "Giao hàng hơi chậm, sản phẩm ổn so với giá tiền.",
        createdAt: "2025-05-22T16:20:00.000Z",
    },
    {
        _id: "r5",
        rating: 4,
        userId: "6831bfc77faba2ce62e0d738",
        productId: "p5",
        comment: "Shop đóng gói đẹp, sản phẩm chất lượng, sẽ quay lại.",
        createdAt: "2025-05-21T11:05:00.000Z",
    },
];



export default function ProductReviews() {
    return (
        <div className="bg-white rounded shadow p-6 mx-auto">
            <h2 className="text-lg font-bold mb-4">ĐÁNH GIÁ SẢN PHẨM</h2>
            <ReviewFilterBar />
            <div>
                {REVIEWS.map((review, idx) => (
                    <ReviewItem key={idx} review={review} />
                ))}
            </div>
        </div>
    );
}
