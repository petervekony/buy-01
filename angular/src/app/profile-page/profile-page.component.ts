import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from '../interfaces/user';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../service/user.service';
import { MediaService } from '../service/media.service';
import { StateService } from '../service/state.service';
import { ValidatorService } from '../service/validator.service';
import { FileSelectEvent } from 'primeng/fileupload';
import { Media } from '../interfaces/media';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  deleteFormOpen = false;
  @ViewChild('profileForm')
    profileForm: ElementRef | undefined;
  @ViewChild('profile')
    profile: ElementRef | undefined;
  @ViewChild('avatarForm')
    avaterForm: ElementRef | undefined;
  formOpen = false;
  formValid = false;
  buttonClicked = false;
  avatarFormOpen = false;
  profileFormOpen = false;
  filename: string = '';
  user$ = new Subject<User>();
  currentUser: User = {} as User;
  fileSelected: File | null = null;
  placeholder: string = environment.placeholder;
  deleteSubscription: Subscription = Subscription.EMPTY;
  imageSubscription: Subscription = Subscription.EMPTY;
  usernameSubscription: Subscription = Subscription.EMPTY;
  userSubscription: Subscription = Subscription.EMPTY;
  avatarSubscription: Subscription = Subscription.EMPTY;
  authSubscription: Subscription = Subscription.EMPTY;
  formSubscription: Subscription = Subscription.EMPTY;
  uploadSubscription: Subscription = Subscription.EMPTY;
  avatar$: BehaviorSubject<string> = new BehaviorSubject(this.placeholder);

  constructor(
    private authService: AuthService,
    private formStateService: FormStateService,
    private cookieService: CookieService,
    private userService: UserService,
    private mediaService: MediaService,
    private stateService: StateService,
    private validatorService: ValidatorService,
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
    this.imageSubscription = this.mediaService.imageAdded$.subscribe(() => {
      this.getAuthAndAvatar();
    });
    this.usernameSubscription = this.userService.usernameAdded$.subscribe(
      (data) => this.user$.next(data),
    );
  }

  private getAuthAndAvatar() {
    this.authSubscription = this.authService.getAuth().subscribe({
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
                  this.avatar$.next(this.mediaService.formatMedia(media));
                }
              },
              error: (err) => console.log(err),
            });
        }
      },
      error: (error) => console.error(error),
    });
    this.formValid = true;
    this.formSubscription = this.formStateService.formOpen$.subscribe(
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
    this.uploadSubscription = this.mediaService.uploadAvatar(
      this.currentUser.id,
      mediaData!,
    ).subscribe({
      next: (data) => {
        this.currentUser.avatar = data.id;
        this.stateService.state = of(this.currentUser);
        this.mediaService.updateImageAdded(data);
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
      this.avatarFormOpen = true;
      this.setToTrue();
      break;
    default:
      this.deleteFormOpen = true;
      this.setToTrue();
    }
  }

  private setToTrue() {
    this.buttonClicked = true;
    this.formStateService.setFormOpen(true);
  }

  onValidate() {
    this.formValid = this.userUpdateForm.valid;
  }

  hideModal(): void {
    this.formStateService.setFormOpen(false);
    this.profileFormOpen = false;
    this.avatarFormOpen = false;
    this.deleteFormOpen = false;
  }

  onSubmit() {
    const request = { ...this.userUpdateForm.value };
    delete request.confirmPassword;
    formatForm();
    this.formStateService.setFormOpen(false);
    this.userSubscription = this.userService.updateUser(
      request,
      this.currentUser.id,
    ).subscribe({
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
    this.deleteSubscription = this.mediaService.deleteAvatar(
      this.currentUser.id,
    ).subscribe({
      //eslint-disable-next-line
      next: (data: any) => console.log(data),
    });
    this.mediaService.updateImageAdded({} as Media);
    this.avatar$.next(this.placeholder);
    this.hideModal();
  }

  ngOnDestroy(): void {
    this.avatarSubscription.unsubscribe();
    this.deleteSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.avatarSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.formSubscription.unsubscribe();
    this.uploadSubscription.unsubscribe();
  }
}
