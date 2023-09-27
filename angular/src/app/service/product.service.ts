import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { ProductRequest } from '../interfaces/product-request';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  //eslint-disable-next-line
  getProducts(): Observable<any> {
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

  addProduct(form: ProductRequest, mediaForm: FormData) {
    const address = environment.productsURL;
    this.http
      //eslint-disable-next-line
      .post<any>(address, form, { withCredentials: true })
      .subscribe({
        next: (data) => {
          console.log(data);
          mediaForm.append('name', '');
          this.addMedia(data?.id, mediaForm);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  addMedia(id: number, image: FormData) {
    const address = environment.mediaURL;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    console.log('this shit ', image.get('image'), { productId: id }, headers);
    this.http
      //eslint-disable-next-line
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
