import { DestroyRef, inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, switchMap } from 'rxjs';
import {
  CartItem,
  CartResponse,
  Order,
  PersonalOrder,
} from '../interfaces/order';
import { Product } from '../interfaces/product';
import { StateService } from './state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Cart } from '../interfaces/cart';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private stateService = inject(StateService);
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);

  private readonly LOCAL_STORAGE_KEY = 'buy-02';

  private user: User = {} as User;
  private cartItems: CartItem[] = [];

  private filterTypeSubject = new BehaviorSubject<string>('ALL');
  filterType$ = this.filterTypeSubject.asObservable();

  private orderUpdateSource = new Subject<Order>();
  orderUpdates$ = this.orderUpdateSource.asObservable();

  private cartItemsSource = new Subject<CartItem[]>();
  cartItems$ = this.cartItemsSource.asObservable();

  constructor() {
    this.stateService.getStateAsObservable().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.user = user;
      this.getCartFromDB().pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((cart) => {
          this.cartItems$ = of(cart.orders);
          this.cartItems = cart.orders;
          console.log('cartItems:', this.cartItems); //NOSONAR;
        });
    });
  }

  getCartFromDB(): Observable<Cart> {
    const address = environment.cartURL;
    return this.http.get<Cart>(address, { withCredentials: true });
  }

  updateOrders(order: Order): void {
    this.orderUpdateSource.next(order);
  }

  setFilterType(filter: string): void {
    this.filterTypeSubject.next(filter);
  }

  resetFilterType(): void {
    setTimeout(() => this.setFilterType('ALL'), 15);
  }

  // sendOrder(): Observable<CartItem[]> {
  //   const address = environment.cartUrl;
  //   return this.http.post<CartItem[]>(address, this.cartItems, {
  //     withCredentials: true,
  //   });
  // }

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
        this.cartItems = [];
        return [];
      }
    }
    this.cartItems = [];
    return [];
  }

  // NOSONAR
  // public class CartResponse {
  //   private Cart cart;
  //   private Boolean processed;
  //   private OrderModifications orderModifications;
  // }

  placeOrder(): Observable<CartResponse> {
    const address = environment.ordersURL;
    return this.http.post<CartResponse>(address, { withCredentials: true });
  }

  getShoppingCart(filter: string = 'ALL'): Observable<CartItem[]> {
    return this.getCartFromDB().pipe(
      switchMap((cart) => this.filterOrders(filter, cart.orders)),
    );
  }

  filterOrders(
    filter: string,
    cartItems: CartItem[],
  ): Observable<CartItem[]> {
    switch (filter) {
    case 'CONFIRMED':
      return of(
        cartItems.filter((e) => e.status === 'CONFIRMED'),
      );
    case 'PENDING':
      return of(
        cartItems.filter((e) => e.status === 'PENDING'),
      );
    case 'CANCELLED':
      return of(
        cartItems.filter((e) => e.status === 'CANCELLED'),
      );
    case 'ALL':
      return of(cartItems);
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

  addToCart(product: Product, quantity: number): void {
    const newOrder = this.createOrder(product, quantity);
    const address = environment.addToCartURL;
    this.http.post<CartItem>(address, newOrder, { withCredentials: true }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((response) => console.log(response)); //NOSONAR
    // NOSONAR
    // const shoppingCart = this.loadFromLocalStorage();
    //NOSONAR

    // NOSONAR
    // if (!shoppingCart.some((e) => e.product.id === product.id)) {
    // shoppingCart.push(newOrder);
    //NOSONAR
    // this.setToStorage(shoppingCart.reverse()); //NOSONAR
    // }
  }

  //eslint-disable-next-line
  getAllOrders(): Observable<PersonalOrder> {
    const address = environment.ordersURL;
    //eslint-disable-next-line
    return this.http.get<PersonalOrder>(address, { withCredentials: true });
  }

  private createOrder(product: Product, quantity: number): CartItem {
    const newOrder = {
      status: 'PENDING',
      buyerId: this.user.id,
      sellerId: product.userId,
      product: product,
      quantity: quantity,
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
    this.setToStorage(shoppingCart);
  }

  removeItem(id: string): void {
    const address = environment.cartURL + '/' + id;
    this.http.delete<CartItem>(address, { withCredentials: true }).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((response) => {
      console.log('delete item response:', response); //NOSONAR
      this.updateOrders({} as Order);
    });
    // this.cartItems = this.loadFromLocalStorage();
    // this.cartItems = this.cartItems.filter((e) => e.product.id !== productId);
    // this.setToStorage(this.cartItems);
    // this.updateOrders({} as Order);
  }

  setToStorage(products: CartItem[]): void {
    const encodedData = btoa(JSON.stringify(products));
    localStorage.setItem(this.LOCAL_STORAGE_KEY, encodedData);
    this.updateOrders({} as Order);
  }
}
