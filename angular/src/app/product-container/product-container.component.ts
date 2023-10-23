import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { ProductService } from '../service/product.service';
import { CookieService } from 'ngx-cookie-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('container')
    container: ElementRef | undefined;

  products: Product[] = [];

  private changeDetector = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cookieService = inject(CookieService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;
    this.showProducts();
  }
  ngAfterViewInit(): void {
    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.showProducts();
      });
  }

  showProducts() {
    this.productService.getProducts().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          if (products) {
            this.products = products.reverse();
            this.changeDetector.detectChanges();
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
