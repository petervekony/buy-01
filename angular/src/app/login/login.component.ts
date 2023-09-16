import { Component } from '@angular/core';
import { Router } from '@angular/router';

// import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private router: Router) {}

  goToRegister() {
    this.router.navigate(['register']);
  }

  sendLogin() {
    console.log('sending the login info');
  }
}
