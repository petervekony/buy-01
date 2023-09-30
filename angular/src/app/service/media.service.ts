import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Media, MediaResponse } from '../interfaces/media';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getProductThumbnail(productId: string): Observable<Media> {
    const address = environment.productMediaURL + productId;
    return this.http.get<Media>(address, { withCredentials: true });
  }

  getProductMedia(productId: string): Observable<MediaResponse> {
    const address = environment.productMediaURL + productId;
    return this.http.get<MediaResponse>(address, { withCredentials: true });
  }
}
