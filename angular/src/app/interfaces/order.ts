import { Product } from './product';

export interface Order {
  id?: string;
  status: 'PENDING' | 'CANCELLED' | 'CONFIRMED';
  buyerId: string;
  sellerId: string;
  product: Product;
  orderPlacedAt?: Date;
  quantity: number;
}

export interface CartItem {
  id?: string;
  status: 'PENDING' | 'CANCELLED' | 'CONFIRMED';
  buyerId: string;
  sellerId: string;
  product: Product;
  addedToCartAt?: Date;
  quantity: number;
}