import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getAuth(): Observable<User> {
    console.log('authService.getAuth() gets called');
    const address = environment.authCheckURL;
    return this.http.get<User>(address, { withCredentials: true });
  }
}
