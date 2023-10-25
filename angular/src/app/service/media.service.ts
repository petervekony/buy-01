import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Media, MediaResponse } from '../interfaces/media';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  imageAddedSource = new BehaviorSubject<Media>({} as Media);
  imageAdded$ = this.imageAddedSource.asObservable();
  placeholder: string = environment.placeholder;

  private http = inject(HttpClient);

  //eslint-disable-next-line
  updateImageAdded(data: any): void {
    console.log(data);
    this.imageAddedSource.next(data);
  }

  getProductThumbnail(productId: string): Observable<Media> {
    const address = environment.productMediaURL + productId;
    return this.http.get<Media>(address, { withCredentials: true });
  }

  getProductMedia(productId: string): Observable<MediaResponse> {
    const address = environment.mediaURL + '/' + productId;
    return this.http.get<MediaResponse>(address, { withCredentials: true });
  }

  getAvatar(userId: string): Observable<Media> {
    const address = environment.userMediaURL + userId;
    return this.http.get<Media>(address, { withCredentials: true });
  }

  addMedia(id: string, image: FormData): Observable<Media> {
    const address = environment.mediaURL;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post<Media>(address, image, {
        params: { productId: id },
        headers: headers,
        withCredentials: true,
      });
  }
  //eslint-disable-next-line
  deleteAvatar(userId: string): any {
    const address = environment.mediaURL;
    return this.http.delete(address, {
      params: { userId: userId },
      withCredentials: true,
    });
  }

  deleteProductImage(mediaId: string): void {
    const address = environment.mediaURL + '/' + mediaId;
    this.http.delete(address, { withCredentials: true }).subscribe((item) =>
      console.log(item)
    );
  }

  uploadAvatar(userId: string, image: FormData): Observable<Media> {
    const address = environment.mediaURL;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'multipart/form-data',
    );
    // headers.append('Content-Type', 'multipart/form-data');
    return this.http
      .post<Media>(address, image, {
        params: { userId: userId },
        headers: headers,
        withCredentials: true,
      }).pipe(
        map((data: Media) => {
          this.updateImageAdded(data);
          return data;
        }),
      );
  }

  formatMedia(media: Media): string {
    if (!media.image) return this.placeholder;
    return 'data:' + media.mimeType + ';base64,' + media.image;
  }

  formatMultipleMedia(media: Media): string {
    if (!media.image || !media.image.data) return this.placeholder;
    return 'data:' + media.mimeType + ';base64,' + media.image.data;
  }
}
