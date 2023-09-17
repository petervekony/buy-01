import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { LoginRequest } from '../login-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formValid: boolean = false;
  target: string = 'login';

  constructor(private router: Router, private userService: UserService) {}

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
    console.log('sending login form:\n', this.loginForm);
    const request: LoginRequest = this.loginForm.value;
    this.userService.sendLoginRequest(request).subscribe(
      (loginData) => {
        console.log('login response:\n', loginData);
        this.router.navigate(['home'], {
          queryParams: { data: JSON.stringify(loginData) },
        });
      },
      (error) => {
        console.log('error in login', error);
      },
    );
  }

  onValidate() {
    this.formValid = this.loginForm.valid;
  }

  sendLogin() {
    console.log('sending the login info');
  }
}
