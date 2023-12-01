import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../service/order.service';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';
import { CartItem, Order } from '../interfaces/order';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  // NOTE: change to Order
  cards$: Observable<CartItem[]> = of([]);

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
        this.getOrders();
      },
    );

    this.orderService.orderUpdates$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getOrders();
      });
  }

  getOrders(): void {
    this.orderService.getShoppingCart().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (products) => {
        this.cards$ = of(products);
        this.empty = products.length === 0;
      },
    });
  }

  confirmOrder(): void {
    this.orderService.sendOrder().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.cards$ = of(response);
      });
  }
}
