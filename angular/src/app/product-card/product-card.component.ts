import { Component, OnDestroy } from '@angular/core';
import { Product } from '../interfaces/product';
import { Subscription } from 'rxjs';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnDestroy {
  product: Product = {} as Product;
  owner: string = '';
  subscription: Subscription;

  constructor(private productService: ProductService) {
    this.subscription = this.productService
      .getOwner(this.product.userId)
      .subscribe({
        //eslint-disable-next-line
        next: (data: any) => (this.owner = data.name),
        //eslint-disable-next-line
        error: (data: any) => console.log(data),
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
