import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { AddProductComponent } from './add-product.component';
import { ProductService } from '../service/product.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  // let service: ProductService;
  let fixture: ComponentFixture<AddProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddProductComponent],
      providers: [ProductService],
      imports: [HttpClientTestingModule, HttpClientModule, ReactiveFormsModule],
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
});
