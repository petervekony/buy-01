import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StateService } from '../service/state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const stateService = inject(StateService);
  const path = route.url.toString();
  const currentUser = stateService.state;

  console.log('path:', path);
  console.log('state:', state);

  switch (path) {
  case 'register':
  case 'login': {
    if (!currentUser) return true;
    break;
  }
  case 'dashboard':
  case 'home': {
    if (currentUser) return true;
    break;
  }
  }
  return false;
};
