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
  avatar$: BehaviorSubject<string> = new BehaviorSubject(this.placeholder);

  constructor(
    private authService: AuthService,
    private formStateService: FormStateService,
    private cookieService: CookieService,
    private userService: UserService,
    private mediaService: MediaService,
    private stateService: StateService,
    private validatorServie: ValidatorService,
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
    this.mediaService.imageAdded$.subscribe(() => {
      this.getAuthAndAvatar();
    });
  }

  private getAuthAndAvatar() {
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
                  this.avatar$.next(this.mediaService.formatAvatar(media));
                }
              },
              error: (err) => console.log(err),
            });
        }
      },
      error: (error) => console.error(error),
    });
    this.formValid = true;
    this.formStateService.formOpen$.subscribe((isOpen) => {
      this.formOpen = isOpen;
    });
  }

  onFileSelected(event: FileSelectEvent) {
    const file = event.files[0];
    if (file) {
      this.filename = file.name;
      this.fileSelected = file;
      console.log(this.fileSelected.toString());
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
    this.mediaService.uploadAvatar(this.currentUser.id, mediaData!).subscribe({
      next: (data) => {
        this.currentUser.avatar = data.id;
        this.stateService.state = of(this.currentUser);
        this.mediaService.imageAddedSource.next(data);
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
    name: new FormControl(null, [this.validatorServie.usernameValidator()]),
    email: new FormControl(null, [this.validatorServie.emailValidator()]),
    password: new FormControl(null, [this.validatorServie.passwordValidator()]),
    confirmPassword: new FormControl(null, [
      this.validatorServie.passwordValidator(),
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
    console.log(request);
    this.formStateService.setFormOpen(false);
    this.userService.updateUser(request, this.currentUser.id).subscribe({
      next: (data) => console.log(data),
      error: (err) => console.log(err),
    });
    this.hideModal();
  }

  deleteAvatar() {
    this.mediaService.deleteAvatar(this.currentUser.id);
  }

  ngOnDestroy(): void {
    this.avatarSubscription.unsubscribe();
  }
}
