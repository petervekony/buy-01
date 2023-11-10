import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from '../interfaces/user';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Subject } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../service/user.service';
import { MediaService } from '../service/media.service';
import { StateService } from '../service/state.service';
import { ValidatorService } from '../service/validator.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { environment } from 'src/environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Media } from '../interfaces/media';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit {
  //TODO: check if we can delete these viewChilds!
  @ViewChild('profileForm')
    profileForm: ElementRef | undefined;
  @ViewChild('profile')
    profile: ElementRef | undefined;
  @ViewChild('avatarForm')
    avatarForm: ElementRef | undefined;

  formOpen = false;
  formValid = false;
  buttonClicked = false;
  profileFormOpen = false;
  deleteAvatarFormOpen = false;
  deleteUserFormOpen = false;
  updateAvatarFormOpen = false;
  deleteFormOpen = false;
  filename: string = '';
  user$ = new Subject<User>();
  // user$: Observable<User>;
  currentUser: User = {} as User;
  fileSelected: File | null = null;
  placeholder: string = environment.placeholder;
  // avatar$: BehaviorSubject<string> = new BehaviorSubject(this.placeholder);

  private formStateService = inject(FormStateService);
  private cookieService = inject(CookieService);
  private userService = inject(UserService);
  private mediaService = inject(MediaService);
  private stateService = inject(StateService);
  private validatorService = inject(ValidatorService);
  private destroyRef = inject(DestroyRef);
  private authService = inject(AuthService);

  avatar$ = this.mediaService.avatar$;
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

  ngOnInit(): void {
    const cookie = this.cookieService.get('buy-01');
    if (!cookie) return;

    this.avatar$ = this.mediaService.avatar$;

    this.authService.getAuth().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.user$.next(user));

    this.userService.usernameAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data) => this.user$.next(data),
      );

    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((open) => {
        if (open) this.formOpen = open;
        else this.closeForms();
      });
  }

  getAuthAndAvatar() {
    this.authService.getAuth().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user$.next(user);
          this.currentUser = user;
          if (user.avatar) {
            this.mediaService.getAvatar(
              this.currentUser.id,
            ).pipe(takeUntilDestroyed(this.destroyRef))
              .subscribe({
                next: (media) => {
                  if (media && media?.image) {
                    this.mediaService.updateAvatar(
                      this.mediaService.formatMedia(media),
                    );
                  }
                },
                error: (err) => console.log(err),
              });
          }
        },
        error: (err) => console.error(err),
      });
    this.formValid = true;
    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (isOpen) => {
          this.formOpen = isOpen;
        },
      );
  }

  onFileSelected(event: FileSelectEvent) {
    const file = event.files[0];
    if (file) {
      this.filename = file.name;
      this.fileSelected = file;
    } else {
      this.fileSelected = null;
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
    this.mediaService.uploadAvatar(
      this.currentUser.id,
      mediaData!,
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.currentUser.avatar = data.id;
        this.stateService.setUserState(this.currentUser);
        console.log(data);
        this.mediaService.updateAvatar(
          this.mediaService.formatMultipleMedia(data),
        );
        this.hideModal();
      },
      error: (err) => console.log(err),
    });
  }

  fileToBlob(file: File): Blob {
    const blob = new Blob([file], { type: file.type });
    return blob;
  }

  userUpdateForm: FormGroup = new FormGroup({
    name: new FormControl(null, [this.validatorService.usernameValidator()]),
    email: new FormControl(null, [this.validatorService.emailValidator()]),
    password: new FormControl(null, [
      this.validatorService.passwordValidator(),
    ]),
    confirmPassword: new FormControl(null, [
      this.validatorService.passwordValidator(),
    ]),
  });

  openForm(type: string) {
    switch (type) {
    case 'profile':
      this.profileFormOpen = true;
      this.setToTrue();
      break;
    case 'avatar':
      this.updateAvatarFormOpen = true;
      this.setToTrue();
      break;
    case 'deleteAvatar':
      this.deleteAvatarFormOpen = true;
      this.setToTrue();
      break;
    case 'deleteUser':
      this.deleteUserFormOpen = true;
      this.setToTrue();
      break;
    default:
      this.deleteUserFormOpen = true;
      this.setToTrue();
    }
  }

  private setToTrue() {
    this.buttonClicked = true;
    this.formStateService.setFormOpen(true);
  }

  private closeForms() {
    this.formOpen = false;
    this.profileFormOpen = false;
    this.deleteAvatarFormOpen = false;
    this.deleteUserFormOpen = false;
    this.updateAvatarFormOpen = false;
    this.deleteFormOpen = false;
  }

  onValidate() {
    this.formValid = this.userUpdateForm.valid;
  }

  hideModal(): void {
    this.formStateService.setFormOpen(false);
    this.profileFormOpen = false;
    this.deleteAvatarFormOpen = false;
    this.deleteUserFormOpen = false;
    this.updateAvatarFormOpen = false;
  }

  onSubmit() {
    const request = { ...this.userUpdateForm.value };
    delete request.confirmPassword;
    formatForm();
    this.formStateService.setFormOpen(false);
    this.userService.updateUser(
      request,
      this.currentUser.id,
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.userService.updateUsernameAdded(data);
      },
      error: (err) => console.log(err),
    });
    this.hideModal();

    function formatForm() {
      if (!request.password) request.password = null;
      if (!request.name) request.name = null;
      if (!request.email) request.email = null;
    }
  }

  deleteAvatar() {
    this.mediaService.deleteAvatar(
      this.currentUser.id,
      //eslint-disable-next-line
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data: any) =>
      console.log(data)
    );
    this.mediaService.updateImageAdded({} as Media);
    this.mediaService.updateAvatar(this.placeholder);
    this.hideModal();
  }

  deleteUser() {
    this.userService.deleteUser(this.currentUser.id).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.userService.logout();
    });
    this.hideModal();
  }
}
