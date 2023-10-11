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
    console.log('authservice cookie:', this.cookieService.check('buy-01'));
    // const cookie = this.cookieService.get('buy-01');
    // if (!cookie) return null;
    const address = environment.authCheckURL;
    return this.http.get<User>(address, { withCredentials: true });
  }
}
