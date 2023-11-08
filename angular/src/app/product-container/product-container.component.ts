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
import { Observable, of, Subject } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { DataService } from '../service/data.service';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('container')
    container: ElementRef | undefined;
  @ViewChild('productDialog')
    productDialog: ElementRef | undefined;

  products$: Observable<Product[]> | null = null;
  dashboard = true;
  showProductForm = false;
  showAddButton = false;
  userProducts$: Observable<Product[]> | null = null;
  user$ = new Subject<User>();
  currentUser: User = {} as User;

  private changeDetector = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cookieService = inject(CookieService);
  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private formStateService = inject(FormStateService);
  private dataService = inject(DataService);
  private stateService = inject(StateService);

  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;

    this.showProducts();

    this.dataService.dashboard$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.toggleDashboard(data);
      });

    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (isOpen) => {
          if (!isOpen && this.dashboard) {
            this.showProductForm = false;
            this.showAddButton = true;
          } else if (isOpen || !this.dashboard) {
            this.showAddButton = false;
          }
        },
      );
    this.formStateService.setFormOpen(false);
  }

  ngAfterViewInit(): void {
    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.dashboard) {
          this.showProducts();
        } else {
          this.getOwnerProducts();
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  toggleDashboard(bool: boolean) {
    this.dashboard = bool;
    this.productService.updateProductAdded({} as Product);
    this.showAddButton = bool;
    this.changeDetector.detectChanges();
  }

  trackById(_: number, product: Product): string {
    return product.id!;
  }

  showProducts() {
    this.stateService.state.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.user$.next(user);
        this.currentUser = user;
        this.productService.getProducts().pipe(
          takeUntilDestroyed(this.destroyRef),
        )
          .subscribe({
            next: (products) => {
              if (products) {
                this.products$ = of(products?.reverse());
                this.changeDetector.detectChanges();
              }
            },
            error: (error) => {
              console.log(error);
            },
          });
      });
  }

  getOwnerProducts() {
    this.productService.getProductsById(this.currentUser.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (products) => {
        this.products$ = of(products?.reverse());
        this.changeDetector.detectChanges();
      },
    });
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
