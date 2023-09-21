import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { LoginRequest } from '../interfaces/login-request';
import { SignupRequest } from '../interfaces/signup-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  sendLoginRequest(request: LoginRequest): Observable<User> {
    const address = environment.loginURL;
    return this.http.post<User>(address, request, { withCredentials: true });
  }

  sendSignupRequest(request: SignupRequest): Observable<User> {
    const address = environment.signupURL;
    return this.http.post<User>(address, request, { withCredentials: true });
  }

  sendUserInfoRequest(): Observable<User[]> {
    const address = environment.usersURL;
    return this.http.get<User[]>(address, { withCredentials: true });
  }

  getUserInfo(): Observable<User[]> {
    const address = environment.usersURL;
    return this.http.get<User[]>(address, { withCredentials: true });
  }
}
