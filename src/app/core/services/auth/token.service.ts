import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessTokenKey = 'access_token';
  private jwtHelper = new JwtHelperService();

  constructor() { }

  setAccessToken(token: string): void {
    sessionStorage.setItem(this.accessTokenKey, token);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.accessTokenKey);
  }

  removeAccessToken(): void {
    sessionStorage.removeItem(this.accessTokenKey);
  }

  isAccessTokenExpired(): boolean {
    const token = this.getAccessToken();
    return token ? this.jwtHelper.isTokenExpired(token) : true;
  }
}
