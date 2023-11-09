import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { of } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { MediaService } from 'src/app/service/media.service';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormStateService } from 'src/app/service/form-state.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @ViewChild('container')
    container: ElementRef | undefined;
  @ViewChild('productModal')
    productModal: ElementRef | undefined;
  @Input()
    product: Product = {} as Product;

  placeholder: string = environment.placeholder;
  imageSrc: string = this.placeholder;
  currentUser?: User;
  modalVisible = false;

  private mediaService = inject(MediaService);
  private authservice = inject(AuthService);
  private formStateService = inject(FormStateService);
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => {
        if (isOpen) {
          this.container?.nativeElement.classList.add('blur-filter');
        } else {
          this.container?.nativeElement.classList.remove('blur-filter');
        }
      });

    this.productService.productAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.changeDetectorRef.detectChanges());

    this.getProductThumbnail();

    this.dataService.ids$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      (id) => {
        this.updateThumbnailIfEmpty(id);
      },
    );

    this.mediaService.imageAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
        this.mediaService.getProductThumbnail(this.product.id!).pipe(
          takeUntilDestroyed(this.destroyRef),
        ).subscribe((data) => {
          if (data) this.imageSrc = this.mediaService.formatMedia(data);
        });
      });

    const cookieCheck = this.authservice.getAuth();
    if (cookieCheck) {
      cookieCheck.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
        (user) => {
          this.currentUser = user;
        },
      );
    }
  }

  private updateThumbnailIfEmpty(id: string) {
    if (id === this.product.id) {
      this.getProductThumbnail();
    }
  }

  private getProductThumbnail() {
    this.mediaService
      .getProductThumbnail(this.product.id!).pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (media) => {
          if (media && media?.image) {
            this.imageSrc = this.mediaService.formatMedia(media);
            // this.changeDetectorRef.detectChanges();
          } else {
            this.imageSrc = environment.placeholder;
            this.changeDetectorRef.detectChanges();
          }
        },
        error: (err) => {
          if (err.status === 404) return of(null);
          return of(null);
        },
      });
  }

  showModal() {
    if (this.productModal) {
      this.dataService.sendProductId(this.product.id!);
      this.formStateService.setFormOpen(true);
      this.productModal.nativeElement.show();
      this.modalVisible = true;
    }
  }

  hideModal() {
    if (this.productModal) {
      this.formStateService.setFormOpen(false);
      this.productModal.nativeElement.close();
      this.modalVisible = false;
    }
  }
}
