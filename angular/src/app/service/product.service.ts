import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts() {
    const address = environment.productsURL;
    return this.http.get(address, { withCredentials: true });
  }

  getOwner(userId: string) {
    const address = environment.productOwnerURL;
    return this.http.get(address, {
      params: { userId: userId },
      withCredentials: true,
    });
  }
}
