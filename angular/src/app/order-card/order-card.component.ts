import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { CartItem } from '../interfaces/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input()
    card: CartItem = {} as CartItem;
  @Input()
    filter: string = 'ALL';

  shopcart = false;
  max: number = 0;

  private orderService = inject(OrderService);
  private router = inject(Router);

  ngOnInit(): void {
    this.shopcart = this.router.url === '/shopcart';
    this.max = this.card.product.quantity;
  }

  updateQuantity() {
    this.orderService.modifyOrder(this.card);
  }

  removeItem() {
    console.log('delete item:', this.card.product.id); //NOSONAR
    this.orderService.removeItem(this.card.id!);
  }
}
