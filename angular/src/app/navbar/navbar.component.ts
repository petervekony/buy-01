import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';
import { Subject } from 'rxjs';
import { FormStateService } from '../service/form-state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  home: boolean = false;
  user$ = new Subject<User>();
  placeholder = '../../assets/images/placeholder.png';
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
    this.home = this.router.url === '/home';
    // this.user = this.stateService.state!;
    this.authService.getAuth().subscribe({
      next: (user) => {
        this.user$.next(user);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  move(location: string) {
    this.formStateService.setFormOpen(false);
    this.router.navigate([location]);
  }

  logout() {
    this.userService.logout();
    this.stateService.resetState();
    this.move('login');
  }
  goToProfile() {
    this.move('profile');
  }
}
