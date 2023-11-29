import { Product } from './product';

export interface Order {
  id?: string;
  name: string;
  status: 'PENDING' | 'CANCELLED' | 'CONFIRMED';
  buyerId: string;
  sellerId: string;
  products: Product[];
  totalPrice: number;
  timestamp?: Date;
}

// export interface OrderGroup {
//   seller: string;
//   products: Product[];
// }
