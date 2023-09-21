import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Media } from '../interfaces/media';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private http: HttpClient) {}

  getProductMedia(): Observable<Media[]> {
    const address = environment.productMediaURL;
    return this.http.get<Media[]>(address, { withCredentials: true });
  }
}
