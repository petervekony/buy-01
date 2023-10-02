import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { catchError, map, Observable, of } from 'rxjs';
import { User } from '../interfaces/user';
import { ProductRequest } from '../interfaces/product-request';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    const address = environment.productsURL;
    return this.http.get<Product[]>(address, { withCredentials: true });
  }

  getOwner(userId: string): Observable<User> {
    const address = environment.productsURL;
    return this.http.get<User>(address, {
      params: { userId: userId },
      withCredentials: true,
    });
  }

  addProduct(form: ProductRequest, mediaForm: FormData): Observable<boolean> {
    const address = environment.productsURL;
    return this.http
      .post<Product>(address, form, { withCredentials: true })
      .pipe(
        map((data: Product) => {
          if (mediaForm.get('image') !== null) {
            this.addMedia(data.id!, mediaForm);
            mediaForm.append('name', '');
            return true;
          }
          return true;
        }),
        catchError((error) => {
          console.log(error);
          return of(false);
        }),
      );
  }

  addMedia(id: string, image: FormData) {
    const address = environment.mediaURL;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    this.http
      .post(address, image, {
        params: { productId: id },
        headers: headers,
        withCredentials: true,
      })
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
