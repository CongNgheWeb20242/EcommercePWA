interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  bankCode?: string;
  payType?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    name?: string;
    vicinity?: string;
    googleAddressId?: string;
  };
}
interface OrderItem {
  product: string; // Product ID
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  user: string; // User ID
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
