import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PaymentService } from '../services/payment/payment.service'; // Ensure this path is correct
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentAuthGuard implements CanActivate {

  constructor(private paymentService: PaymentService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.paymentService.isPaymentSuccessful().pipe(
      map(isSuccessful => {
        if (isSuccessful) {
          return true; // Payment was successful, allow access to the route
        } else {
          this.router.navigate(['/success-receipt']); // Redirect to checkout if payment is not successful
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error checking payment status:', error);
        this.router.navigate(['/files']); // Redirect in case of an error
        return [false];
      })
    );
  }
}
