import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../service/product.service';
import { ProductRequest } from '../interfaces/product-request';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  formValid = false;
  fileSelected: File | null = null;
  filename: string | null = null;
  constructor(private productService: ProductService) {}

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
      console.log('ajdshdshd');
      console.log(this.fileSelected.toString());
      input.value = '';
    } else {
      this.fileSelected = null;
    }
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  // imageForm: FormGroup = new FormGroup({});

  onValidate() {
    this.formValid = this.productForm.valid;
  }
  // loginForm: FormGroup<any>;
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
      this.productService.addProduct(productRequest, mediaData);
    }
  }
}
