import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { CartItem } from '../interfaces/order';
import { User } from '../interfaces/user';
import { OrderService } from '../service/order.service';
import { StateService } from '../service/state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  cards$: Observable<CartItem[]> = of([]);
  user$: Observable<User> | null = null;
  currentUser: User = {} as User;
  empty: boolean = false;
  filterType: string = 'ALL';

  private stateService = inject(StateService);
  private orderService = inject(OrderService);
  private destroyRef = inject(DestroyRef);
  //NOTE: hardcoded for now
  totalAmount: number = 8900009;

  ngOnInit(): void {
    this.user$ = this.stateService.getStateAsObservable();
    this.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (user) => {
        this.currentUser = user;
        this.getOrders();
      },
    );

    this.orderService.filterType$.pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe((filterType) => {
        this.filterType = filterType;
        this.getOrders();
      });

    this.orderService.orderUpdates$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getOrders();
      });
  }

  getOrders(): void {
    this.orderService.getShoppingCart(this.filterType).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (products) => {
        this.cards$ = of(products);
        this.empty = products.length === 0;
      },
    });
  }

  changeFilter(filter: string) {
    this.orderService.setFilterType(filter);
  }

  ngOnDestroy(): void {
    this.orderService.resetFilterType();
  }
}
