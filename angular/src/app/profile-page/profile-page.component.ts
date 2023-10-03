import { Component } from '@angular/core';
import { User } from '../interfaces/user';
// import { UserService } from '../service/user.service';
// import { StateService } from '../service/state.service';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
  placeholder: string = '../../assets/images/placeholder.png';
  user$ = new Subject<User>();
  formOpen = false;
  formValid = false;

  constructor(
    private authService: AuthService,
  ) {
    this.authService.getAuth().subscribe({
      next: (user) => {
        this.user$.next(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.formValid = true;
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) {
        return null;
      }

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control)
        ? { invalidPassword: true }
        : null;
    };
  }
  private usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;
      if (!username) {
        return null;
      }

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control)
        ? { invalidName: true }
        : null;
    };
  }
  private emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) {
        return null;
      }

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control) ||
          Validators.email(control)
        ? { invalidEmail: true }
        : null;
    };
  }

  userUpdateForm: FormGroup = new FormGroup({
    name: new FormControl('', [this.usernameValidator()]),
    email: new FormControl('', [this.emailValidator()]),
    password: new FormControl('', [this.passwordValidator()]),
    confirmPassword: new FormControl('', [this.passwordValidator()]),
  });

  openForm() {
    this.formOpen = true;
  }

  onValidate() {
    this.formValid = this.userUpdateForm.valid;
  }

  onSubmit() {
    // this.userService.updateUser(this.user.id);
    this.formOpen = false;
  }
}
