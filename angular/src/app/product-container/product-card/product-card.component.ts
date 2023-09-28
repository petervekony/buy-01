import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { MediaService } from 'src/app/service/media.service';

// import { combineLatest, map, Subscription } from 'rxjs';
// import { ProductService } from '../service/product.service';
// import { UserService } from '../service/user.service';
// import { MediaService } from '../service/media.service';

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
  subscription: Subscription = Subscription.EMPTY;
  imageSrc: string | ArrayBuffer | null = null;
  // owner: string = '';

  constructor(private mediaService: MediaService) { } // private productService: ProductService, // private userService: UserService,
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
    console.log('this is the productID: ', this.product.id);
    this.subscription = this.mediaService
      .getProductThumbnail(this.product.id!)
      .subscribe({
        next: (media) => {
          if (media && media?.image) {
            this.imageSrc = 'data:' + media.mimeType + ';base64,' + media.image;
          } else {
            this.imageSrc = '../../assets/images/placeholder.png';
          }
        },
        error: (error) => {
          console.log('Error fetching media:', error);
          // Handle the error and set a placeholder image
          this.imageSrc = '../../assets/images/placeholder.png';
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showModal() {
    if (this.productModal) {
      this.productModal.nativeElement.show();
    }
  }

  hideModal() {
    if (this.productModal) {
      this.productModal.nativeElement.close();
    }
  }
}
