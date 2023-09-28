import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  // HttpTestingController,
} from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  // let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: AuthService,
          useValue: {
            getAuth: () => {
              of({
                name: 'taneli',
                email: 'taneli@taneli.com',
                id: '123123123123123',
                role: 'SELLER',
              });
            },
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
    // httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
