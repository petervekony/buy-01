import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { filter } from 'rxjs/operators';
import { MediaService } from '../service/media.service';
import { environment } from 'src/environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('navbar')
    navbar: ElementRef | undefined;

  placeholder = environment.placeholder;
  route: string = '';
  dash = false;
  home = false;
  profile = false;
  currentUser: User = {} as User;
  user$ = new Subject<User>();
  avatar$ = new BehaviorSubject<string>(this.placeholder);

  private router = inject(Router);
  private userService = inject(UserService);
  private stateService = inject(StateService);
  private formStateService = inject(FormStateService);
  private authService = inject(AuthService);
  private mediaService = inject(MediaService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.formStateService.formOpen$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isOpen) => {
        if (isOpen) {
          this.navbar?.nativeElement.classList.add('blur-filter');
        } else {
          this.navbar?.nativeElement.classList.remove('blur-filter');
        }
      });

    this.mediaService.imageAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getAuthAndAvatar();
      });
    this.userService.usernameAdded$.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.user$.next(data);
      });
    this.checkRoutes();
  }

  private getAuthAndAvatar() {
    this.authService.getAuth().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.user$.next(user);
          this.currentUser = user;
          if (user.avatar) {
            this.getAvatar();
          }
        },
        error: (error) => console.error(error),
      });
  }

  private getAvatar() {
    this.mediaService.getAvatar(
      this.currentUser.id,
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (media) => {
        const image = this.mediaService.formatMedia(media);
        this.avatar$.next(image);
      },
      error: (err) => console.log(err),
    });
  }

  private checkRoutes() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd =>
          event instanceof NavigationEnd
        ),
      ).pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: NavigationEnd) => {
        if (event && event.urlAfterRedirects) {
          this.route = event.urlAfterRedirects;
          this.home = this.route === '/home';
          this.dash = this.route === '/dashboard';
          this.profile = this.route === '/profile';
        }
      });
  }

  move(location: string) {
    this.formStateService.setFormOpen(false);
    this.router.navigate([location]);
  }

  logout() {
    this.userService.logout();
    this.formStateService.setFormOpen(false);
    this.stateService.resetState();
    this.move('login');
  }

  goToProfile() {
    this.formStateService.setFormOpen(false);
    this.move('profile');
  }
}
