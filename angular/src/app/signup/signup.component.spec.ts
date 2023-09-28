import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { of } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [CheckboxModule, ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => 'register' }) },
        },
        {
          provide: UserService,
          useValue: {
            sendSignupRequest: () =>
              of({
                message: 'User registered successfully',
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
    });
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize variables', () => {
    expect(component.formValid).toEqual(false);
  });

  it('should validate correct form', () => {
    component.registerForm.setValue({
      name: 'taneli',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    component.onValidate();
    expect(component.formValid).toEqual(true);
  });

  it('should call onSubmit and navigate to home page on successfull signup', () => {
    const userService = TestBed.inject(UserService);
    const router = TestBed.inject(Router);

    component.registerForm.setValue({
      name: 'taneli',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    spyOn(userService, 'sendSignupRequest').and.returnValue(
      of({ message: 'User registered succesfully' }),
    );

    component.registerForm.setValue({
      name: 'taneli',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: true,
    });

    component.onSubmit();

    expect(userService.sendSignupRequest).toHaveBeenCalledWith({
      name: 'taneli',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'SELLER',
    });

    expect(router.navigate).toHaveBeenCalledWith(['home'], {
      state: {
        data: {
          message: 'User registered succesfully',
        },
      },
    });
  });

  it('should not validate: passwords don\'t match', () => {
    component.registerForm.setValue({
      name: 'taneli',
      email: 'email@gmail.com',
      password: 'test12',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    component.onValidate();
    expect(component.formValid).toEqual(false);
  });

  it('should not validate: invalid email', () => {
    component.registerForm.setValue({
      name: 'taneli',
      email: 'email',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    component.onValidate();
    expect(component.formValid).toEqual(false);
  });

  it('should not validate: short name', () => {
    component.registerForm.setValue({
      name: 't',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    component.onValidate();
    expect(component.formValid).toEqual(false);
  });

  it('should not validate: long name', () => {
    component.registerForm.setValue({
      name:
        'tajsdklajsdkljaskldjaklsdjasldlasldpwoqeiweopiqwopeipqowieopqwiepoqwieopiqwepoiqwpoei',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });

    component.onValidate();
    expect(component.formValid).toEqual(false);
  });

  it('should set role as \'CLIENT\'', () => {
    const userService = TestBed.inject(UserService);
    component.registerForm.setValue({
      name: 'test',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: false,
    });

    spyOn(userService, 'sendSignupRequest').and.returnValue(
      of({ message: 'User registered succesfully' }),
    );

    component.onSubmit();
    expect(userService.sendSignupRequest).toHaveBeenCalledWith({
      name: 'test',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'CLIENT',
    });
  });

  it('should set role as \'SELLER\'', () => {
    const userService = TestBed.inject(UserService);
    component.registerForm.setValue({
      name: 'seller',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: true,
    });

    spyOn(userService, 'sendSignupRequest').and.returnValue(
      of({ message: 'User registered succesfully' }),
    );

    component.onSubmit();
    expect(userService.sendSignupRequest).toHaveBeenCalledWith({
      name: 'seller',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'SELLER',
    });
  });
});
