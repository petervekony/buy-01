import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { filter } from 'rxjs/operators';
import { MediaService } from '../service/media.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  placeholder = environment.placeholder;
  routeSubscription: Subscription = Subscription.EMPTY;
  authSubscription: Subscription = Subscription.EMPTY;
  avatarSubscription: Subscription = Subscription.EMPTY;
  route: string = '';
  dash = false;
  home = false;
  profile = false;
  currentUser: User = {} as User;
  user$ = new Subject<User>();
  avatar$ = new BehaviorSubject<string>(this.placeholder);

  constructor(
    private router: Router,
    private stateService: StateService,
    private userService: UserService,
    private authService: AuthService,
    private formStateService: FormStateService,
    private mediaService: MediaService,
  ) {
  }

  ngOnInit(): void {
    this.mediaService.imageAdded$.subscribe(() => {
      this.getAuthAndAvatar();
    });
    this.userService.usernameAdded$.subscribe((data) => {
      this.user$.next(data);
    });
    this.checkRoutes();
  }

  private getAuthAndAvatar() {
    this.authSubscription = this.authService.getAuth().subscribe({
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
    this.avatarSubscription = this.mediaService.getAvatar(
      this.currentUser.id,
    ).subscribe({
      next: (media) => {
        const image = this.mediaService.formatMedia(media);
        this.avatar$.next(image);
      },
      error: (err) => console.log(err),
    });
  }

  private checkRoutes() {
    this.routeSubscription = this.router.events
      .pipe(
        filter((event): event is NavigationEnd =>
          event instanceof NavigationEnd
        ),
      )
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

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    this.avatarSubscription.unsubscribe();
  }
}
