import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../login-request';
import { SignupRequest } from '../signup-request';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  //eslint-disable-next-line
  sendLoginRequest(request: LoginRequest): Observable<any> {
    const address = 'http://localhost:8080/api/auth/signin';
    return this.httpClient.post(address, request);
  }

  // eslint-disable-next-line
  sendSignupRequest(request: SignupRequest): Observable<any> {
    const address = 'http://localhost:8080/api/auth/signup';
    return this.httpClient.post(address, request);
  }
}
