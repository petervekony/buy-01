import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { ProductRequest } from '../interfaces/product-request';
import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  @Input('modalRef')
    modalRef: HTMLDialogElement | undefined;
  @ViewChild('imageUpload')
    imageUpload: ElementRef | undefined;

  formValid = false;
  fileSelected: File | null = null;
  filename: string | null = null;
  requestSent = false;
  productResult: string = '';
  success = false;
  showProductForm = false;
  constructor(
    private productService: ProductService,
    private formStateService: FormStateService,
  ) {
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.showProductForm = isOpen;
    });
  }

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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      this.filename = input.files[0].name;
      this.fileSelected = input.files[0];
      console.log(this.fileSelected.toString());
      // this.imageUpload!.nativeElement.value = this.filename;
    } else {
      this.fileSelected = null;
      // this.imageUpload!.nativeElement.value = '';
    }
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  onValidate() {
    this.formValid = this.productForm.valid;
  }

  submitImage() {}

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
    this.fileSelected = null;
    // this.imageUpload!.nativeElement.files[0].name = '';
  }

  closeModal() {
    this.formStateService.setFormOpen(false);
    this.modalRef!.close();
  }
}
