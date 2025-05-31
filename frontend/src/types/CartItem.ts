import { Product } from "./Product";

export interface CartItem extends Product {
    quantity: number;
    selectSize: string;
    selectColor: string;
    selected: boolean;
}