import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  // Renderer2,
  ViewChild,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { CookieService } from 'ngx-cookie-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('container')
    container: ElementRef | undefined;
  products: Product[] = [];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cookieService: CookieService,
    // private formStateService: FormStateService,
    // private renderer: Renderer2,
  ) {
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
  }
  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;
    this.showProducts();
  }
  ngAfterViewInit(): void {
    this.productService.productAdded$.pipe(takeUntilDestroyed()).subscribe(
      () => {
        this.showProducts();
      },
    );
  }

  showProducts() {
    this.productService.getProducts().pipe(takeUntilDestroyed()).subscribe({
      next: (products) => {
        if (products) this.products = products.reverse();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  showUsers() {
    this.userService.sendUserInfoRequest().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.log('error', error);
      },
    });
  }
}
