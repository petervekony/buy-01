import { DestroyRef, inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Order } from '../interfaces/order';
import { Cart } from '../interfaces/cart';
import { Product } from '../interfaces/product';
import { StateService } from './state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private stateService = inject(StateService);
  private destroyRef = inject(DestroyRef);

  private readonly LOCAL_STORAGE_KEY = 'buy-02';

  private _storage: Map<string, Cart> = new Map<string, Cart>();
  // private _cart: Cart | undefined = {} as Cart; //NOSONAR
  private user: User = {} as User;

  constructor() {
    this.stateService.getStateAsObservable().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.user = user;
      this._storage = this.loadFromLocalStorage();
    });
  }

  private orderUpdateSource = new Subject<Order>();
  orderUpdates$ = this.orderUpdateSource.asObservable();

  updateOrders(order: Order): void {
    this.orderUpdateSource.next(order);
  }

  removeItem(productId: string): void {
    const cart = this.loadFromLocalStorage()?.get(this.user.id);
    console.log('cart2', cart); //NOSONAR
    if (!cart) return;
    const orders = cart.orders.filter((order) => order.productId !== productId);
    const map = new Map<string, Cart>();
    map.set(this.user.id, {
      userId: this.user.id,
      expiration: cart?.expiration ?? new Date(),
      orders: orders ?? [],
    });
    this.setCart(map);
  }

  getOrders(userId: string): Observable<Order[]> | null {
    const orders = this.loadFromLocalStorage()?.get(userId)?.orders;
    console.log(this.loadFromLocalStorage()); //NOSONAR
    console.log(orders); //NOSONAR
    if (orders) return of(orders);
    return of([]);
  }

  private loadFromLocalStorage(): Map<string, Cart> {
    const localStorageData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localStorageData) {
      try {
        const data = JSON.parse(atob(localStorageData));
        return new Map(Object.entries(data));
      } catch (e) {
        this._storage = new Map<string, Cart>();
        return new Map<string, Cart>();
      }
    }
    this._storage = new Map<string, Cart>();
    return new Map<string, Cart>();
  }

  getCart(): Map<string, Cart> {
    return this._storage;
  }

  addToCart(product: Product, userId: string): void {
    const newOrder: Order = {
      name: product.name,
      status: 'PENDING',
      customerId: userId,
      sellerId: product.userId!,
      productId: product.id!,
      quantity: 1,
    };

    if (this._storage.has(userId)) {
      const existingCart = this._storage?.get(userId);
      const updatedCart = this.updateCart(existingCart!, newOrder);
      this.setCart(updatedCart);
    } else {
      const newCart = this.createCart(userId, [newOrder]);
      this.setCart(newCart);
    }
  }

  private updateCart(existingCart: Cart, newOrder: Order): Map<string, Cart> {
    const { userId, orders } = existingCart;
    const expiration = this.calculateExpiration();

    if (orders?.some((order) => order.productId === newOrder.productId)) {
      return this.createCart(userId, orders, expiration);
    } else {
      return this.createCart(userId, [newOrder, ...orders], expiration);
    }
  }

  private createCart(
    userId: string,
    orders: Order[] = [],
    expiration: Date = this.calculateExpiration(),
  ): Map<string, Cart> {
    const newCart: Cart = {
      userId: userId,
      expiration: expiration,
      orders: orders,
    };

    const newCartMap = new Map<string, Cart>();
    newCartMap.set(userId, newCart);

    return newCartMap;
  }

  private calculateExpiration(): Date {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 2);
    return expiration;
  }

  setCart(data: Map<string, Cart>): void {
    this._storage = data;
    const encodedData = btoa(JSON.stringify(Object.fromEntries(data)));
    localStorage.setItem(this.LOCAL_STORAGE_KEY, encodedData);
    this.updateOrders({} as Order);
  }

  resetCart(): void {
    this.setCart(new Map<string, Cart>());
  }
}
