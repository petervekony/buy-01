import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { CartItem, Order } from '../interfaces/order';
import { Product } from '../interfaces/product';
import { StateService } from './state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private stateService = inject(StateService);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);

  private readonly LOCAL_STORAGE_KEY = 'buy-02';

  private user: User = {} as User;
  private products: CartItem[] = [];

  constructor() {
    this.stateService.getStateAsObservable().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.user = user;
      this.products = this.loadFromLocalStorage();
    });
  }

  private filterTypeSubject = new BehaviorSubject<string>('ALL');
  filterType$ = this.filterTypeSubject.asObservable();

  private orderUpdateSource = new Subject<Order>();
  orderUpdates$ = this.orderUpdateSource.asObservable();

  updateOrders(order: Order): void {
    this.orderUpdateSource.next(order);
  }

  setFilterType(filter: string): void {
    this.filterTypeSubject.next(filter);
  }

  resetFilterType(): void {
    setTimeout(() => this.setFilterType('ALL'), 15);
  }

  sendOrder(): Observable<CartItem[]> {
    const address = environment.cartUrl;
    return this.http.post<CartItem[]>(address, this.products, {
      withCredentials: true,
    });
  }

  // getShoppingCart(filter: string = 'ALL'): void {
  //   const address = environment.cartUrl;
  //   this.http.get<CartItem[]>(address, { withCredentials: true }).pipe(
  //     takeUntilDestroyed(this.destroyRef),
  //   )
  //     .subscribe((items) => {
  //       this.products = items;
  //       return this.filterOrders(filter, items);
  //     });
  // }

  private loadFromLocalStorage(): CartItem[] {
    const localStorageData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localStorageData) {
      try {
        const data = JSON.parse(atob(localStorageData)); //NOSONAR
        return data;
      } catch (e) {
        this.products = [];
        return [];
      }
    }
    this.products = [];
    return [];
  }

  getShoppingCart(filter: string = 'ALL'): Observable<CartItem[]> {
    return this.filterOrders(filter, this.loadFromLocalStorage());
  }

  private filterOrders(
    filter: string,
    products: CartItem[],
  ): Observable<CartItem[]> {
    switch (filter) {
    case 'CONFIRMED':
      return of(
        products.filter((e) => e.status === 'CONFIRMED'),
      );
    case 'PENDING':
      return of(
        products.filter((e) => e.status === 'PENDING'),
      );
    case 'CANCELLED':
      return of(
        products.filter((e) => e.status === 'CANCELLED'),
      );
    case 'ALL':
      return of(products);
    }
    return of([]);
  }

  // private filterOrders(filter: string): Observable<CartItem[]> {
  //   switch (filter) {
  //   case 'CONFIRMED':
  //     return of(
  //       this.products.filter((e) => e.status === 'CONFIRMED'),
  //     );
  //   case 'PENDING':
  //     return of(
  //       this.products.filter((e) => e.status === 'PENDING'),
  //     );
  //   case 'CANCELLED':
  //     return of(
  //       this.products.filter((e) => e.status === 'CANCELLED'),
  //     );
  //   case 'ALL':
  //     return of(
  //       this.products,
  //     );
  //   }
  //   return of([]);
  // }

  addToCart(product: Product): void {
    const shoppingCart = this.loadFromLocalStorage();
    //NOSONAR

    if (!shoppingCart.some((e) => e.product.id === product.id)) {
      const newOrder = this.createOrder(product);
      shoppingCart.push(newOrder);
      //NOSONAR
      this.setStorage(shoppingCart.reverse()); //NOSONAR
    }
  }

  private createOrder(product: Product): CartItem {
    const newOrder = {
      status: 'PENDING',
      buyerId: this.user.id,
      sellerId: product.userId,
      product: product,
      quantity: 1,
    } as CartItem;
    return newOrder;
  }

  modifyOrder(cartItem: CartItem): void {
    const shoppingCart = this.loadFromLocalStorage();
    const index = shoppingCart.findIndex((e) =>
      e.product.id === cartItem.product.id
    );
    if (index === -1) return;
    shoppingCart[index] = cartItem;
    this.setStorage(shoppingCart);
  }

  removeItem(productId: string): void {
    this.products = this.loadFromLocalStorage();
    this.products = this.products.filter((e) => e.product.id !== productId);
    this.setStorage(this.products);
    this.updateOrders({} as Order);
  }

  setStorage(products: CartItem[]): void {
    const encodedData = btoa(JSON.stringify(products));
    localStorage.setItem(this.LOCAL_STORAGE_KEY, encodedData);
    this.updateOrders({} as Order);
  }
}
