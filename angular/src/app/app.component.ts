import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'buy-01';
  loggedIn = false;
  subscription = Subscription.EMPTY;
  constructor(private router: Router) {
    this.subscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    ).subscribe((event: NavigationEnd) => {
      console.log('event: ', event.urlAfterRedirects);
      this.loggedIn = this.checkUnauthenticatedRoutes(
        event.urlAfterRedirects,
      );
    });
  }

  ngOnInit(): void {
    this.checkUnauthenticatedRoutes(this.router.url);
  }

  private checkUnauthenticatedRoutes(route: string): boolean {
    return !['/login', '/register'].includes(route);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
