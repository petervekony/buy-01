import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardModalComponent } from './product-card-modal.component';

describe('ProductCardModalComponent', () => {
  let component: ProductCardModalComponent;
  let fixture: ComponentFixture<ProductCardModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardModalComponent],
    });
    fixture = TestBed.createComponent(ProductCardModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a product from the @Input', () => {
    const testProduct = {
      name: 'test',
      description: 'test',
      price: 10,
      quantity: 10,
    };
    component.product = testProduct;
    fixture.detectChanges();
    expect(component.product).toEqual(testProduct);
  });
});
