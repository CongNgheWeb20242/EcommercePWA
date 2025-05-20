export interface Product {
    _id: string;
    name: string;
    slug: string;
    image: string;
    images: string[];
    brand: string;
    description: string;
    price: number;
    countInStock: number;
    category: string;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string;
}
