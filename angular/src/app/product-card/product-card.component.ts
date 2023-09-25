import { Component, Input } from '@angular/core';
import { Product } from '../interfaces/product';

// import { combineLatest, map, Subscription } from 'rxjs';
// import { ProductService } from '../service/product.service';
// import { UserService } from '../service/user.service';
// import { MediaService } from '../service/media.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input()
    product: Product = {} as Product;
  // subscription: Subscription;
  // owner: string = '';

  constructor() // private productService: ProductService,
  // private userService: UserService,
  // private mediaService: MediaService,
  {
    // this.subscription = combineLatest([
    //   this.productService.getProducts(),
    //   this.userService.getUserInfo(),
    //   this.mediaService.getProductMedia(),
    // ]).pipe(
    //   map(([products, users, media]) => {
    //     return products.map((product) => {
    //       const owner = users.find((user) => user.id === product.userId);
    //       const productMedia = media.find((mediaItem) =>
    //         mediaItem.productId === product.id
    //       );
    //       return { ...product, owner, productMedia };
    //     });
    //   }),
    // ).subscribe({
    //   next: (products) => {
    //     this.products = products;
    //   },
    //   error: (error) => {
    //     console.log('error: ', error);
    //   },
    // });
  }

  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
}
