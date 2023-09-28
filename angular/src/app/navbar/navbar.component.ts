import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  home: boolean = false;
  constructor(private router: Router) {
    this.home = this.router.url === '/home';
  }

  move(location: string) {
    this.router.navigate([location]);
  }
}
