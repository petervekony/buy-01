import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-product-card-modal',
  templateUrl: './product-card-modal.component.html',
  styleUrls: ['./product-card-modal.component.css'],
})
export class ProductCardModalComponent {
  @ViewChild('productModal')
    productModal: ElementRef | undefined;

  @Input()
    product!: Product;

  constructor() {}
}
