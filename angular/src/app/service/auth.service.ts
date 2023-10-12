import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  getAuth(): Observable<User> {
    const address = environment.authCheckURL;
    return this.http.get<User>(address, { withCredentials: true });
  }
}
