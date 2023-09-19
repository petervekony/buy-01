import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  //eslint-disable-next-line
  response: any;

  constructor(private route: ActivatedRoute, private router: Router) {
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
    throw new Error('Method not implemented.');
  }
}
