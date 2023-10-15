import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormStateService } from '../service/form-state.service';
import { ProductService } from '../service/product.service';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { CookieService } from 'ngx-cookie-service';

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
  showUserForm = false;
  userProducts$: Observable<Product[]> = of([]);
  products: Product[] = [];
  constructor(
    private formStateService: FormStateService,
    private productService: ProductService,
    private authService: AuthService,
    private cookieService: CookieService,
  ) {
    this.formStateService.formOpen$.subscribe((isOpen) => {
      if (!isOpen) {
        this.showProductForm = false;
      }
    });
  }

  ngOnInit(): void {
    this.productService.productAdded$.subscribe(() => {
      this.getOwnerProducts();
    });
    this.formStateService.setFormOpen(false);
    const cookie = this.cookieService.check('buy-01');
    if (!cookie) return;
  }

  private getOwnerProducts() {
    this.userProducts$ = this.authService
      .getAuth()
      .pipe(
        switchMap((user) => this.productService.getProductsById(user.id)),
        map((products: Product[]) => products.reverse()),
      );
  }

  manageProducts(event: MouseEvent) {
    this.showProductForm = true;
    if (this.productDialog) {
      this.productDialog.nativeElement.show();
    }
    event.preventDefault();
  }
}
