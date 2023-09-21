import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { SignupRequest } from '../interfaces/signup-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  //eslint-disable-next-line
  sendLoginRequest(request: LoginRequest): Observable<any> {
    const address = environment.loginURL;
    return this.http.post(address, request, { withCredentials: true });
  }

  // eslint-disable-next-line
  sendSignupRequest(request: SignupRequest): Observable<any> {
    const address = environment.signupURL;
    return this.http.post(address, request, { withCredentials: true });
  }

  // eslint-disable-next-line
  sendUserInfoRequest(): Observable<any> {
    const address = environment.usersURL;
    return this.http.get(address, { withCredentials: true });
  }
}
