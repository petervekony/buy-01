import { DestroyRef, inject, Injectable, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class StateService implements OnInit {
  private _state: Observable<User> | undefined;
  private _cookie: string | undefined = undefined;

  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.cookie = this.cookieService.get('buy-01');
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
    this.authService.getAuth().pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: User) => {
          this.state = of(user);
        },
        error: (error) => {
          if (error.status !== 200) {
            this.cookieService.delete('buy-01');
            this.router.navigate(['login']);
          }
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
}
