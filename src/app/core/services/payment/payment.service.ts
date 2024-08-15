import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { OrderResponse, PaymentDetails, VerificationResult, VerifyPaymentDetails } from '../../../shared/models/payment/payment.model';
// import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // private apiUrl = environment.apiUrl;


  private apiUrl = 'http://localhost:3000/api/v1/payment';

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

  createOrder(paymentDetails: PaymentDetails): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/createorder`, paymentDetails, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  verifyPayment(paymentDetails: VerifyPaymentDetails): Observable<VerificationResult> {
    return this.http.post<VerificationResult>(`${this.apiUrl}/verifypayment`, paymentDetails, this.getHttpOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}