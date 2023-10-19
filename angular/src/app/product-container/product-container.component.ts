import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { UserService } from '../service/user.service';
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

  //TODO: for testing
  // this.filterSubscription = this.formStateService.formOpen$.subscribe(
  //   (isOpen) => {
  //     if (isOpen) {
  //       this.renderer.addClass(this.container?.nativeElement, 'blur-filter');
  //     } else {
  //       this.renderer.removeClass(
  //         this.container?.nativeElement,
  //         'blur-filer',
  //       );
  //     }
  //   },
  // );

  products: Product[] = [];

  private userService = inject(UserService);
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
          if (products) this.products = products.reverse();
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  showUsers() {
    this.userService.sendUserInfoRequest().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log('error', error);
      },
    });
  }
}
