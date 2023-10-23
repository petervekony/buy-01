import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../service/auth.service';
import { of } from 'rxjs';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../interfaces/user';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  // HttpTestingController,
} from '@angular/common/http/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  // let httpMock: HttpTestingController;
  // let authService: AuthService;
  let userService: UserService;
  let stateService: StateService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [MatIconModule, HttpClientModule, HttpClientTestingModule],
      providers: [
        {
          provide: Router,
          useValue: {
            events: of(new NavigationEnd(0, '/home', '/home')),
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: UserService,
          useValue: {
            logout: jasmine.createSpy('logout'),
            usernameAdded$: of('taneli'),
          },
        },
        {
          provide: StateService,
          useValue: {
            resetState: jasmine.createSpy('resetState'),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getAuth: () =>
              of({
                name: 'taneli',
                email: 'taneli@taneli.com',
                id: '123123123123123',
                role: 'SELLER',
              } as User),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(NavbarComponent);
    // httpMock = TestBed.inject(HttpTestingController);
    component = fixture.componentInstance;
    // authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    stateService = TestBed.inject(StateService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout when logging out', () => {
    component.logout();
    expect(userService.logout).toHaveBeenCalled(); // Verify if the logout method was called
  });

  it('should call resetState when logging out', () => {
    component.logout();
    expect(stateService.resetState).toHaveBeenCalled(); // Verify if the resetState method was called
  });

  it('should call navigate when moving', () => {
    component.move('login');
    expect(router.navigate).toHaveBeenCalledWith(['login']); // Verify if navigate was called with the expected argument
  });
});
