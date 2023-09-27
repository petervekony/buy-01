import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from 'src/environments/environment';
import { of } from 'rxjs';
import { LoginRequest } from '../interfaces/login-request';
import { SignupRequest } from '../interfaces/signup-request';
import { User } from '../interfaces/user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a login request', () => {
    const loginRequest: LoginRequest = {
      name: 'peter',
      password: 'test123',
    };
    const user: User = {
      id: '123123123123',
      email: 'test@test.com',
      jwtToken: 'ajsdklajsdlskldjaskdjalksdjlaksjdlkasjdlkajsdlslkajsd',
      name: 'taneli',
      role: 'ROLE_CLIENT',
    };

    const expectedResponse = user;

    service.sendLoginRequest(loginRequest).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(environment.loginURL);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('should send a signup request', () => {
    const signupRequest: SignupRequest = {
      name: 'peter',
      email: 'peter@peter.com',
      password: 'test123',
      confirmPassword: 'test123',
      role: 'SELLER',
    };
    const expectedResponse = of({
      message: 'User registered successfully',
    });

    service.sendSignupRequest(signupRequest).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = httpMock.expectOne(environment.signupURL);
    expect(req.request.method).toBe('POST');
    req.flush(expectedResponse);
  });

  it('signup url should be environment.signupURL', () => {
    expect(environment.signupURL).toEqual(
      'https://localhost:443/api/auth/signup',
    );
  });

  it('signup url should be environment.loginURL', () => {
    expect(environment.loginURL).toEqual(
      'https://localhost:443/api/auth/signin',
    );
  });
});
