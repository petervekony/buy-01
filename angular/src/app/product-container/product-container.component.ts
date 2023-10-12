import {
  Component,
  ElementRef,
  OnDestroy,
  // Renderer2,
  ViewChild,
} from '@angular/core';
import { Product } from '../interfaces/product';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';
import { CookieService } from 'ngx-cookie-service';

// import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent implements OnDestroy {
  @ViewChild('container')
    container: ElementRef | undefined;
  //eslint-disable-next-line
  response: any;
  products: Product[] = [];
  subscription: Subscription = Subscription.EMPTY;
  filterSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private router: Router,
    private userService: UserService,
    private productService: ProductService,
    private cookieService: CookieService,
    // private formStateService: FormStateService,
    // private renderer: Renderer2,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.response = navigation.extras.state['data'];
      console.log(navigation.extras.state['data']);
    }
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

    //TODO: fix the filter part!
    // this.filterSubscription = this.formStateService.formOpen$.subscribe(
    //   (isOpen) => {
    //     if (isOpen) {
    //       console.log('open');
    //       if (this.container) {
    //         this.renderer.addClass(
    //           this.container?.nativeElement,
    //           'blur-filter',
    //         );
    //       }
    //     } else if (!isOpen) {
    //       console.log('close');
    //       if (this.container) {
    //         this.renderer.removeClass(
    //           this.container?.nativeElement,
    //           'blur-filer',
    //         );
    //       }
    //     } else {
    //       return;
    //     }
    //   },
    // );
  }

  //TODO: only for testing purposes
  showProducts() {
    this.subscription = this.productService.getProducts().subscribe({
      next: (product) => {
        console.log('products: ', product);
        this.products = product;
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
