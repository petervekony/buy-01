import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  //eslint-disable-next-line
  response: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['data']) {
        this.response = JSON.parse(params['data']);
        console.log('data in home:\n', this.response);
      }
    });
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
