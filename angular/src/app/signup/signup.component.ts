import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../service/user.service';
import { SignupRequest } from '../interfaces/signup-request';
import { StateService } from '../service/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  private checkPassword: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { notSame: true };
  };
  formValid: boolean = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private stateService: StateService,
  ) {}

  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(300),
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      role: new FormControl(false),
    },
    { validators: this.checkPassword },
  );

  onValidate() {
    this.formValid = this.registerForm.valid;
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.formValid = false;
    const request: SignupRequest = this.registerForm.value;
    request.role ? (request.role = 'SELLER') : (request.role = 'CLIENT');
    this.userService.sendSignupRequest(request).pipe(takeUntilDestroyed())
      .subscribe({
        error: (error) => {
          this.error = error.error.message;
        },
        complete: () => {
          this.autoLogin(request);
        },
      });
  }

  autoLogin(request: SignupRequest): void {
    this.userService.sendLoginRequest(request).pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          const navigationExtras: NavigationExtras = { state: { data: data } };
          this.stateService.refreshState(data.jwtToken!, data);
          this.router.navigate(['home'], navigationExtras);
        },
        error: (data) => console.log(data),
      });
  }
}
