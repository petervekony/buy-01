import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';
import { Subject, Subscription } from 'rxjs';
import { FormStateService } from '../service/form-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit, OnDestroy {
  route: string;
  home = false;
  user$ = new Subject<User>();
  placeholder = '../../assets/images/placeholder.png';
  subscription: Subscription = Subscription.EMPTY;
  dash = false;
  profile = false;
  // secondUser$ = new BehaviorSubject<User>({
  //   name: 'test',
  //   email: 'akkakaka@kakaka.com',
  //   id: '12837128738178293',
  //   role: 'USSER_ROLE',
  // });
  constructor(
    private router: Router,
    private stateService: StateService,
    private userService: UserService,
    private authService: AuthService,
    private formStateService: FormStateService,
  ) {
    // this.user = this.stateService.state!;
    this.authService.getAuth().subscribe({
      next: (user) => {
        this.user$.next(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.route = '';
  }

  ngOnInit(): void {
    this.subscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      console.log('navbar-ROUTE: ', this.route);
      this.route = event.urlAfterRedirects;
      this.home = this.route === '/home';
      this.dash = this.route === '/dashboard';
      this.profile = this.route === '/profile';
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
    this.subscription.unsubscribe();
  }
}
