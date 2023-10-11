import { Injectable, OnDestroy } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { Observable, of, Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StateService implements OnDestroy {
  private _state: Observable<User> | undefined;
  private subscription: Subscription = Subscription.EMPTY;
  private _cookie: string | undefined = undefined;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
  ) {
    this.cookie = this.cookieService.get('buy-01');
    console.log('stateService constructor & cookie is: ', this.cookie);
    this.state = of({
      name: '',
      email: '',
      password: '',
      role: '',
    } as User);
    if (!this.cookie) return;
    this.initialize();
  }

  initialize(): void {
    console.log('initializing...');
    // const cookieCheck = this.authService.getAuth();
    this.subscription = this.authService.getAuth().subscribe({
      next: (user: User) => {
        this.state = of(user);
        console.log(user);
        // this.roouter.navigate(['home']);
      },
      error: (error) => {
        if (error.status !== 200) this.router.navigate(['login']);
        // this.resetState();
      },
    });
  }

  get state(): Observable<User> | undefined {
    return this._state;
  }

  set state(user: Observable<User> | undefined) {
    this._state = user;
  }

  get cookie(): string | undefined {
    return this._cookie;
  }

  set cookie(cookie: string | undefined) {
    this._cookie = cookie;
  }

  resetState() {
    this.cookie = undefined;
    this.state = undefined;
    const expirationDate = new Date('Thu, 01 Jan 1970 00:00:00 UTC');
    this.cookieService.set(
      'buy-01',
      '',
      expirationDate,
      '/',
      'localhost',
      true,
      'Lax',
    );
    console.log('resetState, this shouldnt happen');
    this.initialize();
  }

  refreshState(jwtToken: string, user: User) {
    this.cookie = jwtToken;
    this.state = of(user);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
