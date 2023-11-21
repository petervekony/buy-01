import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnChanges,
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
import { MediaService } from '../service/media.service';

@Component({
  selector: 'app-product-container',
  templateUrl: './product-container.component.html',
  styleUrls: ['./product-container.component.css'],
})
export class ProductContainerComponent implements OnInit, OnChanges {
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
  profile: boolean = false;

  private changeDetector = inject(ChangeDetectorRef);
  private productService = inject(ProductService);
  private cookieService = inject(CookieService);
  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private formStateService = inject(FormStateService);
  private dataService = inject(DataService);
  private stateService = inject(StateService);
  private mediaService = inject(MediaService);

  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;

    this.stateService.getStateAsObservable().pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe((user) => {
        this.user$.next(user);
        this.currentUser = user;
      });

    this.showProducts();

    this.mediaService.imageAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log('product-container onInit, mediaService.imageAdded$');
        this.changeDetectorRef.detectChanges();
      });

    this.dataService.dashboard$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        console.log('container OnInit, dashboard$, data: ', data);
        this.toggleDashboard(data);
        this.changeDetectorRef.detectChanges();
      });

    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.dashboard) {
          this.showProducts();
        } else {
          this.getOwnerProducts();
        }
        this.changeDetectorRef.detectChanges();
      });

    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (isOpen) => {
          console.log('container OnInit, formOpen$ isOpen = ', isOpen);
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

  ngOnChanges(): void {
    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        console.log(
          'container onChanges, productAdded$ dashboard = ',
          this.dashboard,
        );
        if (!this.dashboard) {
          this.showProducts();
        } else {
          this.getOwnerProducts();
        }
        this.changeDetectorRef.detectChanges();
      });

    this.mediaService.imageAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
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
    console.log('container showProducts()');
    this.productService.getProducts().pipe(
      takeUntilDestroyed(this.destroyRef),
    )
      .subscribe({
        next: (products) => {
          if (products) {
            this.products$ = of(products?.reverse());
            console.log('container, showProwducts, products = ', products);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getOwnerProducts() {
    console.log(
      'container getUserProducts(), currentUser.id = ',
      this.currentUser.id,
    );
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
