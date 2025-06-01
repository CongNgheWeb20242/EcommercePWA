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
<<<<<<< HEAD
        <div className="flex flex-col border-b py-6">
            <div className="flex items-center gap-3 mb-2">
                <CustomImage
                    src={user ? user._id : "1"} //TODO
                    alt={user ? user.name : "Unknown User"}
                    className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="font-semibold text-gray-700">{user ? user.name : "Unknown User"}</span>
                <span>
                    {renderStars(review.rating)}
                </span>
=======
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
>>>>>>> 7620e58a6b92a0aacd5ef40a23da2e20a89f1ead

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