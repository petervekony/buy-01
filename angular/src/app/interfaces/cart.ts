import { Order } from './order';

export interface Cart {
  userId: string;
  orders: Order[];
  expiration: Date;
}
