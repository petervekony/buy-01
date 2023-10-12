import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, of, Subscription } from 'rxjs';
// import { MediaResponse } from 'src/app/interfaces/media';
import { Product } from 'src/app/interfaces/product';
import { ProductRequest } from 'src/app/interfaces/product-request';
import { User } from 'src/app/interfaces/user';
import { FormStateService } from 'src/app/service/form-state.service';
import { MediaService } from 'src/app/service/media.service';
// import { MediaService } from 'src/app/service/media.service';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-product-card-modal',
  templateUrl: './product-card-modal.component.html',
  styleUrls: ['./product-card-modal.component.css'],
})
export class ProductCardModalComponent implements OnInit, OnDestroy {
  @ViewChild('productModal')
    productModal?: ElementRef;
  @Input()
    dialog?: HTMLDialogElement;
  @Input()
    product!: Product;
  @Input()
    user?: User;
  images: string[] = [];
  subscription: Subscription = Subscription.EMPTY;
  ownerSubscription: Subscription = Subscription.EMPTY;
  placeholder: string = '../../assets/images/placeholder.png';
  picture: string = this.placeholder;
  formOpen = true;
  requestSent = false;
  productResult: string = '';
  formValid = true;
  filename: string = '';
  fileSelected: File | null = null;
  success = false;
  confirm = false;
  owner: User = {} as User;

  productForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(300),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30),
    ]),
    price: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999999),
    ]),
    quantity: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999999),
    ]),
    image: new FormControl(),
  });

  // this.imageSrc = 'data:' + media.mimeType + ';base64,' + media.image;

  constructor(
    private mediaService: MediaService,
    private formStateService: FormStateService,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.subscription = this.mediaService
      .getProductThumbnail(this.product.id!)
      .pipe(catchError(() => of(null)))
      .subscribe({
        next: (media) => {
          if (media && media?.image) {
            this.picture = 'data:' + media.mimeType + ';base64,' + media.image;
          }
        },
        error: (err) => {
          if (err.status === 404) return of(null);
          return of(null);
        },
      });

    this.ownerSubscription = this.userService.getOwnerInfo(this.product.userId!)
      .subscribe({
        next: (user) => {
          this.owner = user;
          console.log(user);
        },
        error: (err) => {
          console.log(err);
        },
      });

    // this.subscription = this.mediaService
    //   .getProductMedia(this.product.id!)
    //   .subscribe({
    //     next: (data) => {
    //       this.images = this.convertImages(data);
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //   });

    // this.formStateService.formOpen$.subscribe((isOpen) => {
    //   this.formOpen = isOpen;
    // });

    // this.dialog?.show();

    // if (!this.thumbNail) {
    //   this.picture = this.placeholder;
    // } else {
    //   this.picture = this.thumbNail;
    // }
  }

  hideModal() {
    this.formStateService.setFormOpen(false);
    this.dialog?.close();
    this.confirm = false;
  }

  // private convertImages(data: MediaResponse): string[] {
  //   return data.media.map((media) =>
  //     'data' + media.mimeType + ';base64,' + media.image
  //   );
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.ownerSubscription.unsubscribe();
  }

  onValidate() {
    this.formValid = this.productForm.valid;
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  onFileSelected(event: Event) {
    event.preventDefault();
  }

  submitProduct() {
    const mediaData = new FormData();
    mediaData.append(
      'image',
      this.fileToBlob(this.fileSelected!),
      this.filename as string,
    );

    let productRequest: ProductRequest;
    if (this.formValid) {
      productRequest = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
      } as ProductRequest;
      this.productService.addProduct(productRequest, mediaData).subscribe({
        next: (success: boolean) => {
          this.success = success;
          this.requestSent = true;
          this.productResult = 'Product added successfully';
        },
        error: () => {
          this.success = false;
          this.productResult = 'Error adding product';
        },
      });
    }
    this.productForm.reset();
  }

  deleteProduct(productId: string): void {
    console.log('here,' + productId);
    this.productService.deleteProduct(productId);
  }

  openConfirm() {
    this.confirm = true;
  }

  closeConfirm() {
    this.confirm = false;
  }
}
