import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { AddProductComponent } from '../add-product/add-product.component';
import { ProductService } from '../service/product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
// import { FormStateService } from '../service/form-state.service';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;
  let productService: ProductService;
  // let formStateService: FormStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, NavbarComponent, AddProductComponent],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductsById: () => of([]),
            productAdded$: of({}),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getAuth: () =>
              of({
                name: 'taneli',
                email: 'taneli@taneli.com',
                id: '123123123123123',
                role: 'SELLER',
              }),
          },
        },
      ],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductService);
    // formStateService = TestBed.inject(FormStateService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properties correctly when no cookies are present', () => {
    expect(component.showProductForm).toBe(false);
    expect(component.showAddButton).toBe(true);
    expect(component.products).toEqual([]);
  });

  it('should initialize properties correctly when cookies are present', () => {
    spyOn(component['cookieService'], 'check').and.returnValue(true);

    fixture.detectChanges();

    expect(component.showProductForm).toBe(false);
    expect(component.showAddButton).toBe(true);
    expect(component.userProducts$).toEqual(jasmine.any(Observable));
  });

  xit('should react to formOpen state changes', () => {
    const authService = TestBed.inject(AuthService);
    const getAuthSpy = spyOn(authService, 'getAuth').and.returnValue(
      of({} as User),
    );

    fixture.detectChanges();
    component.manageProducts(new MouseEvent('click'));

    expect(component.showProductForm).toBe(true);
    expect(component.showAddButton).toBe(false);

    expect(component.showProductForm).toBe(false);
    expect(component.showAddButton).toBe(true);
    expect(getAuthSpy).toHaveBeenCalled();
  });

  xit('should retrieve user products on productAdded$', () => {
    const mockProducts = [
      {
        name: 'test',
        quantity: 5,
        description: 'test desc',
        price: 12.99,
        userId: '1',
        id: '123',
        thumbnail: environment.placeholder,
      },
      {
        name: 'test2',
        quantity: 6,
        description: 'test desc2',
        price: 12.99,
        userId: '1',
        id: '1234',
        thumbnail: environment.placeholder,
      },
    ];
    spyOn(productService, 'getProductsById').and.returnValue(of(mockProducts));

    productService.updateProductAdded(mockProducts[0]);
    fixture.detectChanges();

    expect(component.userProducts$).toEqual(of(mockProducts.reverse()));
  });

  it('should manage products and prevent default action', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    spyOn(event, 'preventDefault');
    component.manageProducts(event);

    expect(component.showProductForm).toBe(true);
    expect(component.showAddButton).toBe(false);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
