import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { User } from '../interfaces/user';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const path = route.routeConfig?.path;
  const router = inject(Router);

  authService.getAuth().subscribe({
    next: (user: User) => {
      switch (path) {
      case 'register':
      case 'login': {
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
        if (user && user.name) {
          return true;
        } else {
          router.navigate(['login']);
          return false;
        }
      }
      }
      return false;
    },
    error: (err) => {
      console.error(err);
    },
  });

  return true;
};
