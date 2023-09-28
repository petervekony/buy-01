import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardModalComponent } from './product-card-modal.component';

describe('ProductCardModalComponent', () => {
  let component: ProductCardModalComponent;
  let fixture: ComponentFixture<ProductCardModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardModalComponent]
    });
    fixture = TestBed.createComponent(ProductCardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
