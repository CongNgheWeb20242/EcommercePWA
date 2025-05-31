import { renderStars } from "@/helper/StarGenerate";
import { Review } from "@/types/Review";
import CustomImage from "../ui/image";
import { useEffect, useState } from "react";
import { getUser } from "@/services/api/userService";
import { User } from "@/types/User";
import { UserIcon } from "@heroicons/react/24/outline";

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
        <div className="flex flex-col border-b py-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
                {/* Avatar */}
                {user && user.profilePic ? (
                    <CustomImage
                        src={user.profilePic}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border"
                    />
                ) : (
                    <UserIcon className="w-10 h-10 text-gray-600" />
                )}

                {/* Tên và sao */}
                <span className="font-semibold text-gray-700">{user ? user.name : "Unknown User"}</span>
                <span>{renderStars(review.rating)}</span>

                {/* Thời gian */}
                <div className="text-xs text-gray-500 ml-0 sm:ml-auto w-full sm:w-auto text-right">
                    {review.createdAt}
                </div>
            </div>

            <div className="mb-2 text-gray-800 text-base">{review.comment}</div>
        </div>

    );
}