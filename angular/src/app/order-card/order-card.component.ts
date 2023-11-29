import { Component, inject, Input, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
import { Product } from '../interfaces/product';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent implements OnInit {
  @Input()
    card: Product = {} as Product;

  private orderService = inject(OrderService);

  ngOnInit(): void {
    console.log('shop cart'); //NOSONAR
  }

  removeItem() {
    console.log('delete item:', this.card.id); //NOSONAR
    this.orderService.removeItem(this.card.id!);
  }
}
