import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';
// import { AuthService } from '../service/auth.service';
// import { User } from '../interfaces/user';
// import { Subject } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  // const authService = inject(AuthService);
  const stateService = inject(StateService);
  // const path = route.url.toString();
  const path = route.routeConfig?.path;
  // const currentUser$: Subject<User> | undefined = new Subject<User>();
  // authService.getAuth().subscribe({
  //   next: (user) => {
  //     currentUser$.next(user);
  //   },
  //   error: (err) => {
  //     console.error(err);
  //     currentUser$.next({} as User);
  //   },
  // });
  const currentUser = stateService.state;
  console.log('authGuard, currentUser: ', currentUser);
  const router = inject(Router);

  // console.log('path:', path);
  // console.log('state:', state);

  // if (currentUser) {
  //   return true;
  // } else {
  //   router.navigate(['login']);
  //   return false;
  // }

  switch (path) {
  case 'register':
  case 'login': {
    // return !currentUser;
    if (!currentUser) {
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
    if (currentUser) {
      return true;
    } else {
      router.navigate(['login']);
      return false;
    }
  }
  }
  // router.navigate(['login']);
  return true;
};
