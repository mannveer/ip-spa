import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlEnv = environment.apiUrl;
  private API_URL = `${this.apiUrlEnv}/otp`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/login`, credentials, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.tokenService.setAccessToken(response.accessToken);
        })
      );
  }

  otpLogin(credentials: { email: string, otp: string, purpose: string }): Observable<HttpResponse<any>> {
    return this.http.post(`${this.API_URL}/validate`, credentials, { withCredentials: false,
      observe: 'response',
     })
      .pipe(
        tap((response: any) => {
          this.tokenService.setAccessToken(response.body.accessToken);
        })
      );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/refresh-token`, {}, { withCredentials: true })
      .pipe(
        tap((response: any) => {
          this.tokenService.setAccessToken(response.accessToken);
        })
      );
  }

  logout(): void {
    this.tokenService.removeAccessToken();
    // Optionally call the backend to clear cookies
  }
}
