import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  home: boolean = false;
  user: User;
  constructor(
    private router: Router,
    private stateService: StateService,
    private userService: UserService,
  ) {
    this.home = this.router.url === '/home';
    this.user = this.stateService.state!;
  }

  move(location: string) {
    this.router.navigate([location]);
  }

  logout() {
    this.userService.logout();
    this.stateService.resetState();
    this.move('login');
  }
  goToProfile() {
    this.router.navigate(['profile']);
  }
}
