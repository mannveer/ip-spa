import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { OrderResponse, PaymentDetails, VerificationResult, VerifyPaymentDetails } from '../../../shared/models/payment/payment.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrlEnv = environment.apiUrl;
  private readonly apiUrl = `${this.apiUrlEnv}/payment`;

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

  isPaymentSuccessful(): Observable<boolean> {
    // This should ideally call your backend to verify the payment status
    return this.http.get<{ success: boolean }>('/api/payment/status').pipe(
      map((response:any) => response.success),
      catchError(error => {
        console.error('Payment status check failed:', error);
        return of(false); // Default to false on error
      })
    );
  }

  
}