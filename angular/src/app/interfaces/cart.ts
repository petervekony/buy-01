import { CartItem } from './order';

export interface Cart {
  orders: CartItem[]; //key:sellerId
}
