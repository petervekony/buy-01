import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ProductContainerComponent } from './product-container.component';
import { of } from 'rxjs';
import { ProductService } from '../service/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductCardComponent } from './product-card/product-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardModalComponent } from './product-card-modal/product-card-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { Product } from '../interfaces/product';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('ProductContainerComponent', () => {
  let component: ProductContainerComponent;
  let fixture: ComponentFixture<ProductContainerComponent>;

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([
      {
        id: '1',
        name: 'Product 1',
        price: 10.0,
        quantity: 5,
        description: 'This is product 1',
      },
      {
        id: '2',
        name: 'Product 2',
        price: 20.0,
        quantity: 3,
        description: 'This is product 2',
      },
    ])),
    productAdded$: of({} as Product),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductContainerComponent,
        ProductCardComponent,
        ProductCardModalComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatTabsModule,
        MatIconModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
      ],
      providers: [{
        provide: ProductService,
        useValue: productServiceMock,
      }],
    });
    fixture = TestBed.createComponent(ProductContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit(
    'should display products when there are products',
    () => {
      productServiceMock.getProducts.and.returnValue(of([
        {
          id: '1',
          name: 'Product 1',
          price: 10.0,
          quantity: 5,
          description: 'This is product 1',
        },
        {
          id: '2',
          name: 'Product 2',
          price: 20.0,
          quantity: 3,
          description: 'This is product 2',
        },
      ]));

      productServiceMock.productAdded$ = of({} as Product);
      component.ngAfterViewInit();
      fixture.detectChanges();

      const productElements = fixture.nativeElement.querySelectorAll(
        'app-product-card',
      );

      expect(productElements.length).toBe(2);
    },
  );

  xit('should call showProducts when productAdded$ emits', () => {
    const showProductsSpy = spyOn(component, 'showProducts');
    productServiceMock.productAdded$ = of({} as Product);
    component.ngAfterViewInit();
    expect(showProductsSpy).toHaveBeenCalled();
  });

  xit(
    'should handle the case when there are no products',
    fakeAsync(() => {
      productServiceMock.getProducts.and.returnValue(of([]));
      productServiceMock.productAdded$ = of({} as Product);
      component.ngAfterViewInit();
      tick();
      fixture.detectChanges();
      const productElements = fixture.nativeElement.querySelectorAll(
        'app-product-card',
      );
      expect(productElements.length).toBe(0);
    }),
  );
});
