import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { of } from 'rxjs';
import { User } from '../interfaces/user';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => authGuard(route, state);

  const authServiceSpy = jasmine.createSpyObj('AuthService', ['getAuth']);
  authServiceSpy.getAuth.and.returnValue(of({ name: 'testUser' } as User));

  const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['delete']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'AuthService', useValue: authServiceSpy },
        { provide: 'CookieService', useValue: cookieServiceSpy },
        { provide: 'Router', useValue: routerSpy },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true user is authenticated and path is dashboard', () => {
    const route = {
      routeConfig: { path: 'dashboard' },
    } as ActivatedRouteSnapshot;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canActivate = executeGuard(route, null as any);
    expect(authServiceSpy.getAuth).toHaveBeenCalled();
    expect(canActivate).toBe(true);
  });

  it('should return false and redirect to login if user is not authenticated and path is dashboard', () => {
    const route = {
      routeConfig: { path: 'dashboard' },
    } as ActivatedRouteSnapshot;
    authServiceSpy.getAuth.and.returnValue(of({}));
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canActivate = executeGuard(route, null as any);
    expect(authServiceSpy.getAuth).toHaveBeenCalled();
    expect(canActivate).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });
});
