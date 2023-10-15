import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { Subscription } from 'rxjs';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { CookieService } from 'ngx-cookie-service';
import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent
implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('container')
    container: ElementRef | undefined;
  //eslint-disable-next-line
  products: Product[] = [];
  subscription: Subscription = Subscription.EMPTY;
  filterSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cookieService: CookieService,
    private formStateService: FormStateService,
    private renderer: Renderer2,
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
    // this.subscription = this.productService.getProducts().subscribe({
    //   next: (products) => {
    //     this.products = products;
    //   },
    //   error: (error) => {
    //     console.log('error: ', error);
    //   },
    // });
  }

  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;
    this.showProducts();
  }
  ngAfterViewInit(): void {
    this.productService.productAdded$.subscribe(() => {
      this.showProducts();
    });

    //TODO: fix the filter part!
    this.filterSubscription = this.formStateService.formOpen$.subscribe(
      (isOpen) => {
        if (isOpen) {
          if (this.container) {
            this.renderer.addClass(
              document.body,
              'blur-filter',
            );
          }
        } else if (!isOpen) {
          if (this.container) {
            this.renderer.removeClass(
              document.body,
              'blur-filter',
            );
          }
        } else {
          return;
        }
      },
    );
  }

  showProducts() {
    this.subscription = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.reverse();
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }
}
