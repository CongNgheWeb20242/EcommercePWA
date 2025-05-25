import { renderStars } from "@/helper/StarGenerate";
import { Review } from "@/types/Review";
import CustomImage from "../ui/image";
import { use, useEffect, useState } from "react";
import { getUser } from "@/services/api/userService";
import { User } from "@/types/User";

export default function ReviewItem({ review }: { review: Review }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await getUser(review.userId);
            setUser(fetchedUser);
        }
        fetchUser();
    }, []);


    return (
        <div className="flex flex-col border-b py-6">
            <div className="flex items-center gap-3 mb-2">
                <CustomImage
                    src={user ? user.id : "1"} //TODO
                    alt={user ? user.name : "Unknown User"}
                    className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-semibold text-gray-700">{user ? user.name : "Unknown User"}</span>
                <span>
                    {renderStars(review.rating)}
                </span>

                <div className="text-xs text-gray-500 ml-auto">
                    {review.createdAt}
                </div>
            </div>

            <div className="mb-2 text-gray-800 text-base">{review.comment}</div>
        </div>
    );
}