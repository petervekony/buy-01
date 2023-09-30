export interface Media {
  id: string;
  image: string;
  productId: string;
  userId: string;
  mimeType: string;
}

export interface MediaResponse {
  productId: string;
  media: Media[];
}
