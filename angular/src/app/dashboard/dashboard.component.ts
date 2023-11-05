import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormStateService } from '../service/form-state.service';
import { ProductService } from '../service/product.service';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('productDialog')
    productDialog: ElementRef | undefined;
  @ViewChild('user-dialog')
    userDialog: ElementRef | undefined;
  showProductForm = false;
  showAddButton = true;
  products: Product[] = [];
  userProducts$: Observable<Product[]> = of([]);

  private formStateService = inject(FormStateService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const cookie = this.cookieService.check('buy-01');
    if (!cookie) return;

    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (isOpen) => {
          if (!isOpen) {
            this.showProductForm = false;
            this.showAddButton = true;
          } else {
            this.showAddButton = false;
          }
        },
      );

    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          this.getOwnerProducts();
        },
      );

    this.formStateService.setFormOpen(false);
  }

  getOwnerProducts() {
    this.userProducts$ = this.authService
      .getAuth()
      .pipe(
        switchMap((user) => this.productService.getProductsById(user.id)),
        map((products: Product[]) => products?.reverse()),
      );
  }

  getProductId(_: number, product: Product): string {
    return product.id!;
  }

  manageProducts(event: MouseEvent) {
    this.showProductForm = true;
    this.formStateService.setFormOpen(true);
    if (this.productDialog) {
      this.productDialog.nativeElement.show();
    }
    event.preventDefault();
  }
}
