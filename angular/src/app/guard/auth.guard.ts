import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';
// import { User } from '../interfaces/user';
// import { Subject } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const stateService = inject(StateService);
  // const path = route.url.toString();
  const path = route.routeConfig?.path;
  // const currentUser$: Subject<User> | undefined = new Subject<User>();
  const router = inject(Router);
  // authService.getAuth().subscribe({
  //   next: (user) => {
  //     currentUser$.next(user);
  //   },
  //   error: (err) => {
  //     console.error(err);
  //     currentUser$.next({} as User);
  //   },
  // });

  // stateService.initialize();
  console.log(stateService.state);
  authService.getAuth().subscribe({
    next: (user: User) => {
      console.log('authguard', user);
      switch (path) {
      case 'register':
      case 'login': {
        // return !currentUser;
        if (!user || !user.name) {
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
        if (user && user.name) {
          return true;
        } else {
          router.navigate(['login']);
          return false;
        }
      }
      }
      // router.navigate(['login']);
      return false;
    },
    error: (err) => {
      console.error(err);
    },
  });

  return true;
};
