import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { of, Subject, Subscription } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../service/user.service';
import { MediaService } from '../service/media.service';
import { StateService } from '../service/state.service';

// import { UserUpdateRequest } from '../interfaces/user-update-request';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  @ViewChild('profileForm')
    profileForm: ElementRef | undefined;
  @ViewChild('profile')
    profile: ElementRef | undefined;
  @ViewChild('avatarForm')
    avaterForm: ElementRef | undefined;
  placeholder: string = '../../assets/images/placeholder.png';
  user$ = new Subject<User>();
  currentUser: User = {} as User;
  formOpen = false;
  formValid = false;
  buttonClicked = false;
  avatarFormOpen = false;
  profileFormOpen = false;
  filename: string = '';
  fileSelected: File | null = null;
  avatarSubscription: Subscription = Subscription.EMPTY;
  avatar: string = this.placeholder;

  constructor(
    private authService: AuthService,
    private formStateService: FormStateService, // private renderer: Renderer2,
    private cookieService: CookieService,
    private userService: UserService,
    private mediaService: MediaService,
    private stateService: StateService,
  ) {
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
  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;
    this.authService.getAuth().subscribe({
      next: (user) => {
        this.user$.next(user);
        this.currentUser = user;
        if (user.avatar) {
          this.avatarSubscription = this.mediaService.getAvatar(
            this.currentUser.id,
          )
            .subscribe({
              next: (media) => {
                if (media && media?.image) {
                  this.avatar = 'data:' + media.mimeType + ';base64,' +
                    media.image;
                }
              },
              error: (err) => {
                console.log(err);
              },
            });
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.formValid = true;
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.formOpen = isOpen;
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files?.length > 0) {
      this.filename = input.files[0].name;
      this.fileSelected = input.files[0];
      console.log(this.fileSelected.toString());
      // this.imageUpload!.nativeElement.value = this.filename;
    } else {
      this.fileSelected = null;
      // this.imageUpload!.nativeElement.value = '';
    }
  }

  submitAvatar() {
    let mediaData: FormData | null = null;
    if (this.fileSelected) {
      mediaData = new FormData();
      mediaData.append(
        'image',
        this.fileToBlob(this.fileSelected!),
        this.filename as string,
      );
    }
    this.mediaService.uploadAvatar(this.currentUser.id, mediaData!).subscribe({
      next: (data) => {
        this.currentUser.avatar = data.id;
        this.stateService.state = of(this.currentUser);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
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
    name: new FormControl(null, [this.usernameValidator()]),
    email: new FormControl(null, [this.emailValidator()]),
    password: new FormControl(null, [this.passwordValidator()]),
    confirmPassword: new FormControl(null, [this.passwordValidator()]),
  });

  openForm(type: string) {
    if (type === 'profile') {
      this.profileFormOpen = true;
      this.buttonClicked = true;
      this.formStateService.setFormOpen(true);
    } else {
      this.avatarFormOpen = true;
      this.buttonClicked = true;
      this.formStateService.setFormOpen(true);
    }
  }

  onValidate() {
    this.formValid = this.userUpdateForm.valid;
  }

  hideModal(): void {
    this.formStateService.setFormOpen(false);
    this.profileFormOpen = false;
    this.avatarFormOpen = false;
  }

  onSubmit() {
    const request = this.userUpdateForm.value;
    console.log('update', request);

    console.log('profilepage', this.currentUser.id);
    this.formStateService.setFormOpen(false);
    this.userService.updateUser(request, this.currentUser.id).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.formOpen = false;
  }
  ngOnDestroy(): void {
  }
}
