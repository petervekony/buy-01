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
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormStateService } from '../service/form-state.service';
import { environment } from 'src/environments/environment';
// import { User } from '../interfaces/user';
import { CookieService } from 'ngx-cookie-service';
import { ProductCardComponent } from '../product-container/product-card/product-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ProductCardModalComponent } from '../product-container/product-card-modal/product-card-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;
  let productService: ProductService;
  let cookieService: CookieService;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  let formStateService: FormStateService;
  let authService: AuthService;

  const mockAuth = {
    name: 'taneli',
    email: 'taneli@taneli.com',
    id: '123',
    role: 'SELLER',
  };

  const mockProducts = [{
    name: 'test',
    quantity: 5,
    description: 'test desc',
    price: 12.99,
    userId: '123',
    id: '123',
    thumbnail: environment.placeholder,
  }, {
    name: 'test2',
    quantity: 6,
    description: 'test desc2',
    price: 12.99,
    userId: '123',
    id: '1234',
    thumbnail: environment.placeholder,
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        NavbarComponent,
        AddProductComponent,
        ProductCardComponent,
        ProductCardModalComponent,
      ],
      providers: [
        CookieService,
        ProductService,
        AuthService,
      ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FileUploadModule,
        InputTextareaModule,
        InputNumberModule,
        MatIconModule,
        MatTabsModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
      ],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    productService = TestBed.inject(ProductService);
    cookieService = TestBed.inject(CookieService);
    formStateService = TestBed.inject(FormStateService);
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  // afterEach(() => {
  //   httpMock.verify();
  // });

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

  it('should react to formOpen state changes', () => {
    spyOn(cookieService, 'check').and.returnValue(true);

    const formStateService = TestBed.inject(FormStateService);
    const formOpen$Spy = spyOn(formStateService, 'setFormOpen');

    component.manageProducts(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.showProductForm).toBe(true);
    expect(formOpen$Spy).toHaveBeenCalledWith(true);

    component.manageProducts(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.showProductForm).toBe(true);
    expect(formOpen$Spy).toHaveBeenCalledWith(true);
    expect(formOpen$Spy).toHaveBeenCalledTimes(2);
  });

  it(
    'should update userProducts$ when productService.productAdded$ emits',
    () => {
      spyOn(cookieService, 'check').and.returnValue(true);
      const getAuthSpy = spyOn(authService, 'getAuth').and.returnValue(
        of(mockAuth),
      );
      const getProductsByIdSpy = spyOn(productService, 'getProductsById').and
        .returnValue(of(mockProducts)).and.callThrough();

      productService.updateProductAdded(mockProducts[0]);

      component.getOwnerProducts();
      fixture.detectChanges();

      let req = httpMock.expectOne(environment.userProductsURL + mockAuth.id);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);

      expect(getAuthSpy).toHaveBeenCalled();

      expect(getProductsByIdSpy).toHaveBeenCalled();

      component.userProducts$.subscribe((userProducts) => {
        expect(userProducts).toEqual(mockProducts.reverse());
      });

      req = httpMock.expectOne(environment.userProductsURL + mockAuth.id);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    },
  );

  it('should manage products and prevent default action', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    spyOn(event, 'preventDefault');
    component.manageProducts(event);

    expect(component.showProductForm).toBe(true);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
