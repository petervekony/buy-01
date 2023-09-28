import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../service/state.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  home: boolean = false;
  constructor(private router: Router, private stateService: StateService) {
    this.home = this.router.url === '/home';
  }

  move(location: string) {
    this.router.navigate([location]);
  }

  logout() {
    this.stateService.resetState();
    this.move('login');
  }
}
