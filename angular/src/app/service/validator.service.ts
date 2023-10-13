import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}

  numberValidator(): ValidatorFn {
    //eslint-disable-next-line
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && isNaN(Number(value))) {
        return { 'invalidNumber': { value: control.value } };
      }
      return null;
    };
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordsMatch = control.get('password')?.value ===
        control?.get('confirmPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      const password = control.value;
      if (!password && !confirmPassword) return null;

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control) ||
          !passwordsMatch
        ? { invalidPassword: true }
        : null;
    };
  }
  usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const username = control.value;
      if (!username) return null;

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control)
        ? { invalidName: true }
        : null;
    };
  }
  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      if (!email) return null;

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control) ||
          Validators.email(control)
        ? { invalidEmail: true }
        : null;
    };
  }
}
