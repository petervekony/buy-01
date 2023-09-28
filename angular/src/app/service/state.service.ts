import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { Subscription } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class StateService implements OnInit, OnDestroy {
  private _state: User | undefined = undefined;
  private subscription: Subscription = Subscription.EMPTY;
  private _cookie: string | undefined = undefined;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  ngOnInit(): void {
    this.cookie = this.cookieService.get('buy-01');
    if (!this.cookie) return;

    this.subscription = this.authService.getAuth().subscribe({
      next: (user: User) => {
        this.state = user;
      },
      error: (error: string) => {
        console.log(error);
        this.resetState();
      },
    });
  }

  get state(): User | undefined {
    return this._state;
  }

  set state(user: User | undefined) {
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
    this.ngOnInit();
  }

  refreshState(jwtToken: string, user: User) {
    this.cookie = jwtToken;
    this.state = user;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
