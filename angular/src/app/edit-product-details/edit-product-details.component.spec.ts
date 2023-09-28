import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductDetailsComponent } from './edit-product-details.component';

describe('EditProductDetailsComponent', () => {
  let component: EditProductDetailsComponent;
  let fixture: ComponentFixture<EditProductDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProductDetailsComponent]
    });
    fixture = TestBed.createComponent(EditProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
