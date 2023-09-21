import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  //eslint-disable-next-line
  response: any;

  constructor(private router: Router, private userService: UserService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.response = navigation.extras.state['data'];
      console.log(navigation.extras.state['data']);
      console.log(this.response);
    }
  }

  goBack() {
    this.router.navigate(['login']);
  }

  showUsers() {
    this.userService.sendUserInfoRequest().subscribe((data) => {
      console.log(data);
    });
  }
}
