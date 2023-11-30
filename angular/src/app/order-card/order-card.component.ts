import { Component, inject, Input } from '@angular/core';
import { OrderService } from '../service/order.service';
import { CartItem } from '../interfaces/order';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.css'],
})
export class OrderCardComponent {
  @Input()
    card: CartItem = {} as CartItem;

  private orderService = inject(OrderService);

  removeItem() {
    console.log('delete item:', this.card.product.id); //NOSONAR
    this.orderService.removeItem(this.card.product.id!);
  }
}
