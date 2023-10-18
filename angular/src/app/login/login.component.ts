import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  formValid: boolean = false;
  subscription: Subscription;
  user: User | undefined;
  error: string | null = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private stateService: StateService,
  ) {
    this.subscription = Subscription.EMPTY;
  }

  loginForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(300),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30),
    ]),
  });

  goToRegister() {
    this.router.navigate(['register']);
  }

  onSubmit() {
    const request: LoginRequest = this.loginForm.value;
    this.userService.sendLoginRequest(request).pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          const navigationExtras: NavigationExtras = { state: { data: data } };
          this.stateService.refreshState(data.jwtToken!, data);
          this.router.navigate(['home'], navigationExtras);
        },
        error: (data) => {
          this.error = data.error.message;
        },
      });
  }

  onValidate() {
    this.formValid = this.loginForm.valid;
  }
}
