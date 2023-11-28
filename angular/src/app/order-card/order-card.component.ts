import { Component, inject, Input, OnInit } from '@angular/core';
import { Order } from '../interfaces/order';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input()
    card: Order = {} as Order;

  private orderService = inject(OrderService);

  ngOnInit(): void {
    console.log('shop cart'); //NOSONAR
  }

  removeItem() {
    console.log('delete item:', this.card.productId); //NOSONAR
    this.orderService.removeItem(this.card.productId);
  }
}
