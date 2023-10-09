import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormStateService } from '../service/form-state.service';
import { ProductService } from '../service/product.service';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

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
  constructor(
    private formStateService: FormStateService,
    private productService: ProductService,
    private authService: AuthService,
  ) {
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.showProductForm = isOpen;
    });
  }

  ngOnInit(): void {
    this.userProducts$ = this.authService.getAuth().pipe(
      switchMap((user) => this.productService.getProductsById(user.id)),
    );
  }

  manageProducts(event: MouseEvent) {
    this.formStateService.setFormOpen(true);
    if (this.productDialog) {
      this.productDialog.nativeElement.show();
    }
    event.preventDefault();
  }

  openProfileForm(event: MouseEvent) {
    event.preventDefault();
  }
}
