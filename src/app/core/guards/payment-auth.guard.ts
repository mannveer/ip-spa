import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserFileInfoService } from '../services/user-file-info/user-file-info.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentAuthGuard implements CanActivate {

  constructor(private userfileinfoservice: UserFileInfoService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const fileId = route.params['fileId']; 
    const userEmail = localStorage.getItem('userEmail'); 

    if (!fileId || !userEmail) {
      console.error('Missing fileId or userEmail');
      this.router.navigate(['/files']); 
      return of(false);
    }

    return this.userfileinfoservice.isPaymentSuccessful(fileId, userEmail).pipe(
      map(isSuccessful => {
        localStorage.removeItem('userEmail');
        if (isSuccessful) {
          return true; 
        } else {
          this.router.navigate(['/files']); 
          return false;
        }
      }),
      catchError((error) => {
        localStorage.removeItem('userEmail');
        console.error('Error checking payment status:', error);
        this.router.navigate(['/files']); 
        return of(false);
      })
    );
  }
}
