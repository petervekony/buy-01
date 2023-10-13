import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { ProductRequest } from '../interfaces/product-request';
import { FormStateService } from '../service/form-state.service';
import { Product } from '../interfaces/product';
import { Location } from '@angular/common';
import { ValidatorService } from '../service/validator.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  @Input()
    product?: Product;
  @Input('modalRef')
    modalRef?: HTMLDialogElement;
  @ViewChild('imageUpload')
    imageUpload?: ElementRef;
  @Input()
    dialog?: HTMLDialogElement;

  formValid = false;
  fileSelected: File | null = null;
  filename: string | null = null;
  requestSent = false;
  productResult: string = '';
  success = false;
  showProductForm = false;
  edit: boolean = this.product !== undefined;

  constructor(
    private productService: ProductService,
    private formStateService: FormStateService,
    private location: Location,
    private validatorService: ValidatorService,
  ) {}

  ngOnInit(): void {
    if (this.dialog) {
      this.dialog.show();
      this.modalRef?.show();
      this.showProductForm = true;
      this.formStateService.setFormOpen(true);
    }

    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.product
        ? (this.showProductForm = true)
        : (this.showProductForm = isOpen);
    });
  }

  productForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(300),
    ]),
    price: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999999),
      this.validatorService.numberValidator(),
    ]),
    quantity: new FormControl(0, [
      Validators.required,
      Validators.min(0),
      Validators.max(99999999999),
      this.validatorService.numberValidator(),
    ]),
    image: new FormControl(),
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      this.filename = input.files[0].name;
      this.fileSelected = input.files[0];
    } else {
      this.fileSelected = null;
    }
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  onValidate() {
    this.formValid = this.productForm.valid;
  }

  refresh() {
    this.location.go(this.location.path());
  }

  submitProduct() {
    let mediaData: FormData | null = null;
    if (this.fileSelected) {
      mediaData = new FormData();
      mediaData.append(
        'image',
        this.fileToBlob(this.fileSelected!),
        this.filename as string,
      );
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

  closeModal() {
    this.formStateService.setFormOpen(false);
    this.modalRef?.close();
    this.refresh();
  }
}
