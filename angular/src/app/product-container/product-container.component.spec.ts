import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductContainerComponent } from './product-container.component';
import { UserService } from '../service/user.service';
import { of } from 'rxjs';
import { ProductService } from '../service/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductContainerComponent', () => {
  let component: ProductContainerComponent;
  let fixture: ComponentFixture<ProductContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductContainerComponent],
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        {
          provide: UserService,
          useValue: {
            sendLoginRequest: () =>
              of({
                id: '123123123123',
                email: 'test@test.com',
                jwtToken:
                  'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
                name: 'taneli',
                role: 'ROLE_CLIENT',
              }),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ProductContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
