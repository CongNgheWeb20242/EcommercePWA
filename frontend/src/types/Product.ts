import { Category } from "./Category";

export interface Product {
    _id: string;
    name: string;
    image: string;
    images: string[];
    brand: string;
    description: string;
    price: number;
    countInStock: number;
    category: Category;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}
