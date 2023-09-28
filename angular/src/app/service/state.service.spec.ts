import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';

import { StateService } from './state.service';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('StateService', () => {
  let service: StateService;
  // let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
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
    service = TestBed.inject(StateService);
    // cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
