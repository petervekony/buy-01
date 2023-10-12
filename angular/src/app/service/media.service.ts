import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  getAvatar(userId: string): Observable<Media> {
    const address = environment.userMediaURL + userId;
    return this.http.get<Media>(address, { withCredentials: true });
  }

  uploadAvatar(userId: string, image: FormData): Observable<Media> {
    console.log('image', image);
    const address = environment.mediaURL;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post<Media>(address, image, {
        params: { userId: userId },
        headers: headers,
        withCredentials: true,
      });
    // .subscribe({
    //   next: (data) => {
    //     console.log(data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
  }
}
