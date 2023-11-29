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
  private _cart: Cart | undefined = {} as Cart; //NOSONAR
  private user: User = {} as User;

  constructor() {
    this.stateService.getStateAsObservable().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.user = user;
      this._storage = this.loadFromLocalStorage();
      this._cart = this._storage?.get(this.user.id);
    });
  }

  private orderUpdateSource = new Subject<Order>();
  orderUpdates$ = this.orderUpdateSource.asObservable();

  updateOrders(order: Order): void {
    this.orderUpdateSource.next(order);
  }

  //NOTE: FUCK THIS
  getCart(userId: string): Observable<Cart> | null {
    const cart = this.loadFromLocalStorage()?.get(userId);
    console.log(this.loadFromLocalStorage()); //NOSONAR
    console.log(cart); //NOSONAR
    if (!cart) return null;
    return of(cart);
  }

  private loadFromLocalStorage(): Map<string, Cart> {
    const localStorageData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localStorageData) {
      try {
        // const data = JSON.parse(atob(localStorageData));
        const data = JSON.parse(localStorageData);
        return new Map(Object.entries(data));
      } catch (e) {
        this._storage = new Map<string, Cart>();
        return new Map<string, Cart>();
      }
    }
    this._storage = new Map<string, Cart>();
    return new Map<string, Cart>();
  }

  getStorage(): Map<string, Cart> {
    return this._storage;
  }

  addToCart(product: Product, userId: string): void {
    let cart = this._storage?.get(userId);
    if (!cart) cart = this.createCart();
    const updatedCart = this.updateCart(cart, product);
    this._storage = this._storage.set(userId, updatedCart);
    // this._storage.set(userId, updatedCart);
    console.log('addToCart, this._storage', this._storage);
    this.setStorage();
    console.log('cart:', this._storage); //NOSONAR
  }

  private updateCart(existingCart: Cart, newProduct: Product): Cart {
    const orders: Map<string, Order> = existingCart.orders;
    console.log('updateCart:', orders);
    if (orders.has(newProduct.userId!)) {
      console.log('orders.has!!');
      const products = orders.get(newProduct.userId!)?.products;
      if (!products?.includes(newProduct)) {
        products!.push(newProduct);
      }
    } else {
      console.log('order didnt have');
      existingCart = this.createOrder(existingCart, newProduct);
      console.log('existingCaart:', existingCart);
    }
    return existingCart;
  }

  createCart(): Cart {
    return { orders: new Map<string, Order>() } as Cart;
  }

  private createOrder(existingCart: Cart, product: Product): Cart {
    const newOrder = {
      status: 'PENDING',
      buyerId: this.user.id,
      sellerId: product.userId,
      products: [product],
      totalPrice: product.price,
    } as Order;
    existingCart.orders.set(product.userId!, newOrder);
    return existingCart;
  }

  removeItem(productId: string): void {
    console.log(productId); //NOSONAR
  }

  // private createStorage(
  //   userId: string,
  //   orders: Map<string, Order> = new Map<string, Order>(),
  // ): Map<string, Cart> {
  //   const newCart: Cart = {
  //     orders: orders,
  //   };

  //   const storage = new Map<string, Cart>();
  //   storage.set(userId, newCart);

  //   return storage;
  // }

  setStorage(): void {
    // this._storage.set(userId, cart);
    const encodedData = JSON.stringify(Object.fromEntries(this._storage));
    // const encodedData = btoa(JSON.stringify(Object.fromEntries(this._storage)));
    localStorage.setItem(this.LOCAL_STORAGE_KEY, encodedData);
    // this.updateOrders({} as Order);
  }
}
