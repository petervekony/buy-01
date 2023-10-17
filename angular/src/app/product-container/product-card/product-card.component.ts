import {
  Component,
  ElementRef,
  // HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { of, Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { MediaService } from 'src/app/service/media.service';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/service/auth.service';
import { FormStateService } from 'src/app/service/form-state.service';
import { environment } from 'src/environments/environment';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit, OnDestroy {
  @ViewChild('productModal')
    productModal: ElementRef | undefined;
  @Input()
    product: Product = {} as Product;
  placeholder: string = environment.placeholder;
  imageSrc: string = this.placeholder;
  userSubscription: Subscription = Subscription.EMPTY;
  subscription: Subscription = Subscription.EMPTY;
  currentUser?: User;
  modalVisible = false;

  constructor(
    private mediaService: MediaService,
    private authservice: AuthService,
    private formStateService: FormStateService,
    private dataService: DataService,
  ) {}
  // private mediaService: MediaService,
  // this.subscription = combineLatest([
  //   this.productService.getProducts(),
  //   this.userService.getUserInfo(),
  //   this.mediaService.getProductMedia(),
  // ])
  //   .pipe(
  //     map(([products, users, media]) => {
  //       return products.map((product) => {
  //         const owner = users.find((user) => user.id === product.userId);
  //         const productMedia = media.find(
  //           (mediaItem) => mediaItem.productId === product.id,
  //         );
  //         return { ...product, owner, productMedia };
  //       });
  //     }),
  //   )
  //   .subscribe({
  //     next: (products) => {
  //       this.products = products;
  //     },
  //     error: (error) => {
  //       console.log('error: ', error);
  //     },
  //   });
  ngOnInit(): void {
    this.getProductThumbnail();
    this.dataService.data$.subscribe(() => {
      this.getProductThumbnail();
    });

    const cookieCheck = this.authservice.getAuth();
    if (cookieCheck) {
      this.userSubscription = cookieCheck.subscribe((user) => {
        this.currentUser = user;
      });
    }
  }

  private getProductThumbnail() {
    this.subscription = this.mediaService
      .getProductThumbnail(this.product.id!)
      .subscribe({
        next: (media) => {
          if (media && media?.image) {
            this.imageSrc = 'data:' + media.mimeType + ';base64,' +
              media.image;
          } else {
            this.imageSrc = environment.placeholder;
          }
        },
        error: (err) => {
          if (err.status === 404) return of(null);
          return of(null);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  // TODO: FIX THE CLICK LISTENER!
  // @HostListener('document:click')
  // onClick(event: MouseEvent) {
  //   if (
  //     this.modalVisible &&
  //     this.productModal &&
  //     this.productModal.nativeElement.contains(event.target)
  //   ) {
  //     this.hideModal();
  //   }
  // }

  showModal() {
    if (this.productModal) {
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
