import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { LoginRequest } from '../interfaces/login-request';
import { SignupRequest } from '../interfaces/signup-request';
import { UserUpdateRequest } from '../interfaces/user-update-request';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  //
  //TODO: add the update username live!

  usernameAddedSource = new BehaviorSubject<User>({} as User);
  usernameAdded$ = this.usernameAddedSource.asObservable();

  constructor(private http: HttpClient) {}

  sendLoginRequest(request: LoginRequest): Observable<User> {
    const address = environment.loginURL;
    return this.http.post<User>(address, request, { withCredentials: true });
  }

  sendSignupRequest(request: SignupRequest): Observable<User> {
    console.log('sendSignupRequest: ', request);
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

  getOwnerInfo(id: string): Observable<User> {
    const address = environment.usersURL + '/' + id;
    return this.http.get<User>(address, { withCredentials: true });
  }

  logout() {
    const address = environment.logoutURL;
    this.http.post(address, { withCredentials: true });
  }

  updateUser(request: UserUpdateRequest, id: string): Observable<User> {
    const address = environment.usersURL + '/' + id;
    return this.http.put<User>(address, request, { withCredentials: true });
  }
}
