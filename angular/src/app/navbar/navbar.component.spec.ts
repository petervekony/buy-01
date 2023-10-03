import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../service/auth.service';
import { of } from 'rxjs';
import { StateService } from '../service/state.service';
import { UserService } from '../service/user.service';
import { Router } from '@angular/router';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [],
      providers: [
        {
          provide: Router,
          useValue: {
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
              }),
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
