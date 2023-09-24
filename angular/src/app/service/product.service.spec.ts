import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('ProductService', () => {
  let service: ProductService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //   it('should get products', () => {
  //     const mockProducts: Product[] = [{/* ... mock product data ... */}];

  //     service.getProducts().subscribe((products) => {
  //       expect(products).toEqual(mockProducts);
  //     });

  //     const req = httpTestingController.expectOne(`${environment.productsURL}`);
  //     expect(req.request.method).toEqual('GET');

  //     req.flush(mockProducts);
  //   });

  //   it('should get owner', () => {
  //     const userId = '123';  // Replace with a valid userId
  //     const mockUser: User = {/* ... mock user data ... */};

  //     service.getOwner(userId).subscribe((user) => {
  //       expect(user).toEqual(mockUser);
  //     });

  //     const req = httpTestingController.expectOne(`${environment.productsURL}?userId=${userId}`);
  //     expect(req.request.method).toEqual('GET');

  //     req.flush(mockUser);
  //   });
  // });
});
