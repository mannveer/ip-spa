import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../core/services/auth/auth.service';
import { TokenService } from '../core/services/auth/token.service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    if (accessToken && !this.tokenService.isAccessTokenExpired()) {
      req = this.addTokenHeader(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          return this.handle401Error(req, next);
        }
        return throwError(error);
      })
    );
  }

  private addTokenHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.isRefreshing = true;

    return this.authService.refreshToken().pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;
        return next.handle(this.addTokenHeader(req, response.accessToken));
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(error);
      })
    );
  }
}
