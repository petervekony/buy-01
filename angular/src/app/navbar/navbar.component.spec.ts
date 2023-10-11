import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../service/auth.service';
import { of } from 'rxjs';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { NavigationEnd, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../interfaces/user';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [MatIconModule],
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
          useValue: {},
        },
        {
          provide: StateService,
          useValue: {},
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
