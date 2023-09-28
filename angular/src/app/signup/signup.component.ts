import { Component, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { StateService } from '../service/state.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnDestroy {
  private checkPassword: ValidatorFn = (
    form: AbstractControl,
  ): ValidationErrors | null => {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { notSame: true };
  };
  formValid: boolean = false;
  subscription: Subscription = Subscription.EMPTY;

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
      confirmPassword: new FormControl('', [Validators.required]),
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
    console.log('sending out the reg form:\n', request);
    this.subscription = this.userService.sendSignupRequest(request).subscribe({
      error: (error) => {
        console.log('error: ', error);
      },
      complete: () => {
        this.autoLogin(request);
      },
    });
  }

  autoLogin(request: SignupRequest): void {
    console.log('loginRequest', request);
    this.subscription = this.userService.sendLoginRequest(request).subscribe({
      next: (data) => {
        console.log('login response:\n', data);
        const navigationExtras: NavigationExtras = { state: { data: data } };
        this.stateService.refreshState(data.jwtToken!, data);
        this.router.navigate(['home'], navigationExtras);
      },
      error: (data) => console.log(data),
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
