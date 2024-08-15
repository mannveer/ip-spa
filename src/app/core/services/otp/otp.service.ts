import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OtpResponse, SendOtpRequest, VerifyOtpRequest } from '../../../shared/models/otp/otp.model';
import { VerificationResult } from '../../../shared/models/payment/payment.model';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService {
  // private apiUrl = environment.apiUrl;
  private apiUrl = "http://localhost:3000/api/v1/otp";

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken'); // Retrieve your token from storage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}` // Assuming Bearer token authentication
      })
    };
  }

  sendOtp(email: string,purpose:string): Observable<HttpResponse<OtpResponse>> {
    const requestBody: SendOtpRequest = { email,purpose };
    // Merge the existing HTTP options with { observe: 'response' }
    const options = { ...this.getHttpOptions(), observe: 'response' as 'response' };
    return this.http.post<OtpResponse>(`${this.apiUrl}/generate`, requestBody, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyOtp(otpDetails: VerifyOtpRequest): Observable<HttpResponse<VerificationResult>> {
    const options = { ...this.getHttpOptions(), observe: 'response' as 'response' };
    return this.http.post<VerificationResult>(`${this.apiUrl}/validate`, otpDetails, options)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    // let errorMessage = '';
    // if (error.error instanceof ErrorEvent) {
    //   // Client-side error
    //   errorMessage = `Error: ${error.error.message}`;
    // } else {
    //   // Server-side error
    //   errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    // }
    // return throwError(errorMessage);
    return throwError(error)
  }
}
