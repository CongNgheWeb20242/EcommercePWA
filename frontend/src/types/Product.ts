import { Category } from "./Category";
import { Review } from "./Review";

export interface Product {
    _id: string;
    name: string;
    image: string;
    images: string[];
    brand: string;
    description: string;
    price: number;
    size: string[];
    color: string[];
    averageRating: number;
    reviews: Review[];
    countInStock: number;
    category: Category;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}