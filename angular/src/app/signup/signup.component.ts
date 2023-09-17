import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../service/user.service';
import { SignupRequest } from '../signup-request';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
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

  constructor(private router: Router, private userService: UserService) {}

  registerForm: FormGroup = new FormGroup({
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
    ]),
    role: new FormControl(false),
  }, { validators: this.checkPassword });

  onValidate() {
    this.formValid = this.registerForm.valid;
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    this.formValid = false;
    const request: SignupRequest = this.registerForm.value;
    request.role ? request.role = 'SELLER' : request.role = 'CLIENT';
    console.log('sending out the reg form:\n', request);
    this.userService.sendSignupRequest(request).subscribe(
      (signupData) => {
        console.log('signup response:\n', signupData);
        this.router.navigate(['home'], {
          queryParams: { data: JSON.stringify(signupData) },
        });
      },
    );
  }
}
