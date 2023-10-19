import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AddProductComponent } from './add-product.component';
import { ProductService } from '../service/product.service';
import { HttpClientModule } from '@angular/common/http';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  // let service: ProductService;
  let fixture: ComponentFixture<AddProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      providers: [ProductService],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FileUploadModule,
        InputTextareaModule,
        InputNumberModule,
      ],
    });
    fixture = TestBed.createComponent(AddProductComponent);
    // service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly', () => {
    expect(component).toBeTruthy();
    expect(component.productForm).toBeInstanceOf(FormGroup);
    expect(component.productForm.get('name')).toBeTruthy();
    expect(component.formValid).toBeFalse();
    expect(component.fileSelected).toBeNull();
    expect(component.filename).toBeNull();
    expect(component.requestSent).toBeFalse();
    expect(component.success).toBeFalse();
    expect(component.showProductForm).toBeFalse();
    expect(component.edit).toBeFalse();
  });

  it('should correctly validate the form', () => {
    component.productForm.setValue({
      name: 'Product Name',
      description: 'Product Description',
      price: 10,
      quantity: 5,
    });
    component.onValidate();
    expect(component.formValid).toBeTrue();

    // Test with invalid data
    component.productForm.setValue({
      name: 'Pr', // Invalid name
      description: 'Product Description',
      price: -1, // Invalid price
      quantity: 5,
    });
    component.onValidate();
    expect(component.formValid).toBeFalse();
  });
});
