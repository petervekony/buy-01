import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
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
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to register page', () => {
    const router = TestBed.inject(Router);

    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['register']);
  });

  it('should call onSubmit and navigate to home page on succesfull login', () => {
    const userService = TestBed.inject(UserService);
    const router = TestBed.inject(Router);

    spyOn(userService, 'sendLoginRequest').and.returnValue(of({
      id: '123123123123',
      email: 'test@test.com',
      jwtToken: 'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
      name: 'taneli',
      role: 'ROLE_CLIENT',
    }));

    component.loginForm.setValue({
      name: 'testuser',
      password: 'testpassword',
    });
    component.onSubmit();

    expect(userService.sendLoginRequest).toHaveBeenCalledWith({
      name: 'testuser',
      password: 'testpassword',
    });
    expect(router.navigate).toHaveBeenCalledWith(['home'], {
      queryParams: {
        data: JSON.stringify({
          id: '123123123123',
          email: 'test@test.com',
          jwtToken: 'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
          name: 'taneli',
          role: 'ROLE_CLIENT',
        }),
      },
    });
  });
});
