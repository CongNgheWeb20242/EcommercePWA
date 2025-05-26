import { Product } from "./Product";

export interface CartItem extends Product {
    quantity: number;
    selectSize: string;
    selected: boolean;
}