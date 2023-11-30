import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order } from '../interfaces/order';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../service/order.service';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  // NOTE: change to Order
  cards$: Observable<Order[]> | null = null;

  // NOTE: just for testing this part!
  // cards$: Observable<Product[]> | null = null;
  currentUser: User = {} as User;
  user$: Observable<User> | null = null;
  empty = true;

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
    this.orderService.getOrders(userId)?.pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe((orders) => {
        this.empty = orders.length === 0;
        this.cards$ = of(orders);
        console.log('orders:', orders); //NOSONAR
      });
  }
}
