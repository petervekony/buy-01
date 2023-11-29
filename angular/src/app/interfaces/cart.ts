import { Order } from './order';

export interface Cart {
  orders: Map<string, Order>; //key:sellerId
}
