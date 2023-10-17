import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { of, Subscription } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { ProductRequest } from 'src/app/interfaces/product-request';
import { User } from 'src/app/interfaces/user';
import { DataService } from 'src/app/service/data.service';
import { FormStateService } from 'src/app/service/form-state.service';
import { MediaService } from 'src/app/service/media.service';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { ValidatorService } from 'src/app/service/validator.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-card-modal',
  templateUrl: './product-card-modal.component.html',
  styleUrls: ['./product-card-modal.component.css'],
})
export class ProductCardModalComponent implements OnInit, OnDestroy {
  @ViewChild('tabGroup')
    tabGroup!: MatTabGroup;
  @ViewChild('productModal')
    productModal?: ElementRef;
  @ViewChild('imageUpload')
    imageUploadButton: FileUpload | undefined;
  @Input()
    dialog?: HTMLDialogElement;
  @Input()
    product!: Product;
  @Input()
    user?: User;
  images: string[] = [];
  imageIds: string[] = [];
  mediaSubscription: Subscription = Subscription.EMPTY;
  tumbnailSubscription: Subscription = Subscription.EMPTY;
  ownerSubscription: Subscription = Subscription.EMPTY;
  mediaUpdateSubscription: Subscription = Subscription.EMPTY;
  placeholder: string = environment.placeholder;
  picture: string = this.placeholder;
  formOpen = false;
  formValid = true;
  success = false;
  confirm = false;
  requestSent = false;
  imageValid = false;
  productResult: string = '';
  errorMessage: string = '';
  filename: string = '';
  fileSelected: File | null = null;
  owner: User = {} as User;
  price: number = 0;
  quantity: number = 0;
  currentImageIndex = 0;

  productForm: FormGroup = new FormGroup({
    name: new FormControl(null, [this.validatorService.productNameValidator()]),
    description: new FormControl(null, [
      this.validatorService.productDescriptionValidator(),
    ]),
    price: new FormControl(null, [
      this.validatorService.productPriceValidator(),
    ]),
    quantity: new FormControl(null, [
      this.validatorService.productQuantityValidator(),
    ]),
  });

  constructor(
    private mediaService: MediaService,
    private formStateService: FormStateService,
    private productService: ProductService,
    private userService: UserService,
    private validatorService: ValidatorService,
    private dataService: DataService,
  ) {
  }

  ngOnInit(): void {
    this.initFormValues();

    this.tumbnailSubscription = this.mediaService.getProductThumbnail(
      this.product.id!,
    ).subscribe((media) => {
      if (media) {
        this.picture = this.mediaService.formatMedia(media);
      }
    });

    this.dataService.ids$.subscribe((id) => {
      console.log(id);
      console.log(this.product.id === id);
      if (id !== this.product.id) return;
      this.mediaSubscription = this.mediaService
        .getProductMedia(this.product.id!)
        .subscribe({
          next: (data) => {
            if (data && data.media && data.media.length > 0) {
              this.images = data.media.map((item) => {
                this.imageIds.push(item.id);
                return this.mediaService.formatMultipleMedia(item);
              });
            }
          },
          error: () => of(null),
        });

      this.ownerSubscription = this.userService.getOwnerInfo(
        this.product.userId!,
      )
        .subscribe({
          next: (user) => this.owner = user,
          error: (err) => console.log(err),
        });
    });
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1) % this.images.length;
  }

  deleteImage(index: number) {
    const id = this.imageIds[index];
    this.images.splice(index, 1);
    this.imageIds.splice(index, 1);
    this.mediaService.deleteProductImage(id);
    this.currentImageIndex--;
    //HACK
    this.dataService.sendData('doit');
    if (this.currentImageIndex < 0) this.currentImageIndex = 0;
    if (this.images.length === 0) this.picture = this.placeholder;
  }

  private initFormValues() {
    this.productForm.get('price')?.setValue(this.product.price);
    this.productForm.get('quantity')?.setValue(this.product.quantity);
  }

  hideModal() {
    this.formStateService.setFormOpen(false);
    this.dialog?.close();
    this.confirm = false;
  }

  onValidate() {
    this.formValid = this.productForm.valid;
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  onFileSelected(event: FileSelectEvent) {
    const input = event.files[0];
    if (input) {
      this.filename = input.name;
      this.fileSelected = input;
      this.imageValid = true;
    } else {
      this.fileSelected = null;
      this.imageValid = false;
    }
  }

  submitProduct() {
    let mediaData;
    if (this.fileSelected) {
      mediaData = new FormData();
      mediaData.append(
        'image',
        this.fileToBlob(this.fileSelected),
        this.filename as string,
      );
    } else {
      mediaData = null;
    }

    let productRequest: ProductRequest;
    if (this.formValid) {
      productRequest = {
        name: this.productForm.value.name,
        description: this.productForm.value.description,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
      } as ProductRequest;
      this.productService.addProduct(productRequest, mediaData).subscribe({
        next: (data: Product | null) => {
          this.success = data !== null;
          this.requestSent = true;
          this.productResult = 'Product added successfully';
          this.productService.updateProductAdded(data!);
        },
        error: () => {
          this.success = false;
          this.productResult = 'Error adding product';
        },
      });
    }
    this.productForm.reset();
    this.imageUploadButton!.clear();
    this.tabGroup.selectedIndex = 0;
  }

  submitImage() {
    if (!this.fileSelected) return;
    const mediaForm = new FormData();
    mediaForm.append(
      'image',
      this.fileToBlob(this.fileSelected),
      this.filename,
    );
    this.mediaUpdateSubscription = this.mediaService.addMedia(
      this.product.id!,
      mediaForm,
    ).subscribe({
      next: (data) => {
        this.images.push(this.mediaService.formatMultipleMedia(data));
        this.fileSelected = null;
        this.filename = '';
        this.dataService.sendProductId(this.product.id!);
      },
      error: (err) => this.errorMessage = err.error.message,
    });
    this.tabGroup.selectedIndex = 0;
    this.dataService.sendProductId(this.product.id!);
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId);
  }

  openConfirm() {
    this.confirm = true;
  }

  closeConfirm() {
    this.confirm = false;
  }

  ngOnDestroy(): void {
    this.mediaSubscription.unsubscribe();
    this.ownerSubscription.unsubscribe();
    this.tumbnailSubscription.unsubscribe();
    this.mediaUpdateSubscription.unsubscribe();
  }
}
