export interface Order {
  name: string;
  status: 'PENDING' | 'CANCELLED' | 'CONFIRMED';
  customerId: string;
  sellerId: string;
  productId: string;
  quantity: number;
}
