import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../service/order.service';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';
import { Product } from '../interfaces/product';
import { Order } from '../interfaces/order';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  // NOTE: change to Order
  cards$: Observable<Product[]> | null = null;

  // NOTE: just for testing this part!
  // cards$: Observable<Product[]> | null = null;
  currentUser: User = {} as User;
  user$: Observable<User> | null = null;
  empty = true;
  orders: Map<string, Order> | null = null;

  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private stateService = inject(StateService);

  ngOnInit(): void {
    this.user$ = this.stateService.getStateAsObservable();
    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (user) => {
        this.currentUser = user;
        this.getOrders(this.currentUser.id);
        console.log('user:', this.currentUser); //NOSONAR
      },
    );

    this.orderService.orderUpdates$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.getOrders(this.currentUser.id));
  }

  getOrders(userId: string): void {
    this.orderService.getCart(userId)?.pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe((data) => {
        this.orders = data.orders;

        for (const value of Object.values(data.orders)) {
          this.cards$ = of(value.products);
        }
        // this.empty = data.products.length === 0;
        // this.cards$ = of(data.products);
        // console.log('orders:', data.products); //NOSONAR
      });
  }
}
