import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/product';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { User } from '../interfaces/user';
import { ProductRequest } from '../interfaces/product-request';
import { ProductCreationResponse } from '../interfaces/product-creation-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productAddedSource = new BehaviorSubject<Product | null>(
    {} as Product,
  );
  productAdded$ = this.productAddedSource.asObservable();
  private userProductsSource = new BehaviorSubject<Product[]>([]);
  userProducts$ = this.userProductsSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

  getProducts(): Observable<Product[]> {
    const address = environment.productsURL;
    return this.http.get<Product[]>(address, { withCredentials: true });
  }

  // TODO: create the endpoint to get products by userId
  // getProductsByUserId(userId: string): Observable<Product[]> {
  //   const address = environment.userProductsURL+userId;
  //   return this.http.get<Product[]>(address, { withCredentials: true });
  // }

  getProductsById(userId: string): Observable<Product[]> {
    const address = environment.productsURL;
    return this.http
      .get<Product[]>(address, { withCredentials: true })
      .pipe(
        map((products) =>
          products?.filter((product) => product.userId == userId)
        ),
      );
  }

  getOwner(userId: string): Observable<User> {
    const address = environment.productsURL;
    return this.http.get<User>(address, {
      params: { userId: userId },
      withCredentials: true,
    });
  }

  getOwnerProducts() {
    this.userProducts$ = this.authService
      .getAuth()
      .pipe(switchMap((user) => this.getProductsById(user.id)));
  }

  addProduct(
    form: ProductRequest,
    mediaForm: FormData | null,
  ): Observable<Product | null> {
    const address = environment.productsURL;
    return this.http
      .post<ProductCreationResponse>(address, form, { withCredentials: true })
      .pipe(
        map((data: ProductCreationResponse) => {
          if (mediaForm && mediaForm.get('image') !== null) {
            this.addMedia(data.product.id!, mediaForm);
            mediaForm.append('name', '');
            return data.product;
          }
          this.productAddedSource.next(data.product);
          return data.product;
        }),
        catchError((error) => {
          console.log(error);
          return of(null);
        }),
      );
  }

  addMedia(id: string, image: FormData): void {
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

  deleteProduct(id: string): void {
    const address = environment.productsURL + '/' + id;
    console.log('address', address, id);
    this.http.delete(address, { withCredentials: true }).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
