import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { StateService } from '../service/state.service';
import { AuthService } from '../service/auth.service';
import { User } from '../interfaces/user';
import { Subject } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  // const stateService = inject(StateService);
  const path = route.url.toString();
  const currentUser$ = new Subject<User>();
  authService.getAuth().subscribe({
    next: (user) => {
      currentUser$.next(user);
    },
    error: (err) => {
      console.error(err);
    },
  });
  // const currentUser = stateService.state;
  const router = inject(Router);

  console.log('path:', path);
  console.log('state:', state);

  switch (path) {
  case 'register':
  case 'login': {
    // return !currentUser;
    if (!currentUser$) {
      return true;
    } else {
      router.navigate(['home']);
      return false;
    }
  }
  case 'profile':
  case 'dashboard':
  case 'home': {
    // return !!currentUser;
    if (currentUser$) {
      return true;
    } else {
      router.navigate(['login']);
      return false;
    }
  }
  }
  return true;
};
