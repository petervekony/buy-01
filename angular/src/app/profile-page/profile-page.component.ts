import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent {
  @ViewChild('profileForm')
    profileForm: ElementRef | undefined;
  @ViewChild('profile')
    profile: ElementRef | undefined;
  placeholder: string = '../../assets/images/placeholder.png';
  user$ = new Subject<User>();
  formOpen = false;
  formValid = false;
  buttonClicked = false;

  constructor(
    private authService: AuthService,
    private formStateService: FormStateService,
    private renderer: Renderer2,
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
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.formOpen = isOpen;
    });
    //TODO: fix if clicked outside form, close form!
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   if (
    //     this.buttonClicked &&
    //     this.profileForm?.nativeElement &&
    //     this.formOpen
    //   ) {
    //     if (this.profileForm?.nativeElement !== e.target) {
    //       this.formStateService.setFormOpen(false);
    //       this.buttonClicked = false;
    //     }
    //   }
    // });
  }

  private passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordsMatch = control.get('password')?.value ===
        control?.get('confirmPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      const password = control.value;
      if (!password && !confirmPassword) {
        return null;
      }

      return Validators.minLength(4)(control) ||
          Validators.maxLength(30)(control) ||
          !passwordsMatch
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
    this.buttonClicked = true;
    this.formStateService.setFormOpen(true);
  }

  onValidate() {
    this.formValid = this.userUpdateForm.valid;
  }

  onSubmit() {
    this.formStateService.setFormOpen(false);
    // this.userService.updateUser(this.user.id);
    this.formOpen = false;
  }
}
