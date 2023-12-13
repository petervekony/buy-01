import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CartItem } from '../interfaces/order';
import { User } from '../interfaces/user';
import { OrderService } from '../service/order.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input()
    card: CartItem = {} as CartItem;
  @Input()
    filter: string = 'PENDING';
  @Input()
    user: User = {} as User;

  isOnShopcart = false;
  isOnDashboard = false;
  isSeller: boolean | undefined = undefined;

  max: number = 0;
  seller: User = {} as User;
  buyer: User = {} as User;

  private destroyRef = inject(DestroyRef);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getOwnerInfo(this.card.sellerId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.seller = user;
    });

    this.userService.getOwnerInfo(this.card.buyerId).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((user) => {
      this.buyer = user;
    });

    this.isOnShopcart = this.router.url === '/shopcart';
    this.isOnDashboard = this.router.url === '/dashboard';
    this.isSeller = this.user.role === 'ROLE_SELLER' ||
      this.user.role === 'SELLER';
    //NOSONAR
    // this.isSeller$.next(this.user.role === 'SELLER');
    this.max = this.card.product.quantity;

    //NOSONAR
    // this.isNotSeller$ = this.isSeller$.pipe(map((value) => !value));
    console.log(this.user);
    console.log(this.user.role === 'SELLER');
  }

  // updateQuantity() {
  //   this.orderService.modifyOrder(this.card);
  // }

  changeOrderStatus(status: string) {
    this.orderService.changeOrderStatus(this.card.id!, status).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((order) => {
      console.log('order:', order); //NOSONAR
      this.orderService.updateOrders(order);
    });
  }

  reOrder(orderId: string) {
    this.orderService.reOrder(orderId);
  }

  removeItem() {
    console.log('delete item:', this.card.product.id); //NOSONAR
    this.orderService.removeItem(this.card.id!);
  }
}
