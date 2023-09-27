import { Binary } from './binary';

export interface Media {
  id: string;
  image: Binary;
  productId: string;
  userId: string;
  mimeType: string;
}
