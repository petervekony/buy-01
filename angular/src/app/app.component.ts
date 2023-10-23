import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'buy-01';
  loggedIn = false;

  private router = inject(Router);

  ngOnInit(): void {
    this.checkUnauthenticatedRoutes(this.router.url);
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      this.loggedIn = this.checkUnauthenticatedRoutes(
        event.urlAfterRedirects,
      );
    });
  }

  private checkUnauthenticatedRoutes(route: string): boolean {
    return !['/login', '/register'].includes(route);
  }
}
