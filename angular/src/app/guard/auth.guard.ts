import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '../service/state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const path = route.url.toString();
  const currentUser = stateService.state;
  const router = inject(Router);

  console.log('path:', path);
  console.log('state:', state);

  switch (path) {
  case 'register':
  case 'login': {
    if (!currentUser) {
      return true;
    } else {
      router.navigate(['/home']);
    }
    break;
  }
  case 'profile':
  case 'dashboard':
  case 'home': {
    if (currentUser) {
      return true;
    } else {
      router.navigate(['/login']);
    }
    break;
  }
  }
  return false;
};
