import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupComponent } from './signup.component';
import { of } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { UserService } from '../service/user.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        CheckboxModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => 'register' }) },
        },
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
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should not validate: invalid role', () => {
    component.registerForm.setValue({
      name:
        'tajsdklajsdkljaskldjaklsdjasldlasldpwoqeiweopiqwopeipqowieopqwiepoqwieopiqwepoiqwpoei',
      email: 'email@gmail.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'ADMIN',
    });

    component.onValidate();
    expect(component.formValid).toEqual(false);
  });
});
