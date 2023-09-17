import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../login-request';
import { SignupRequest } from '../signup-request';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  //eslint-disable-next-line
  sendLoginRequest(request: LoginRequest): Observable<any> {
    const address = environment.loginURL;
    return this.httpClient.post(address, request);
  }

  // eslint-disable-next-line
  sendSignupRequest(request: SignupRequest): Observable<any> {
    const address = environment.signupURL;
    return this.httpClient.post(address, request);
  }
}
