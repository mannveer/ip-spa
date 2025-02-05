import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFile } from '../../../shared/models/user-file/user-file.model';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserFileInfoService {
  // apiUrl = 'http://localhost:3000/api/v1/user';
  private apiUrlEnv = environment.apiUrl;
  private apiUrl = `${this.apiUrlEnv}/user`;

  constructor(private http: HttpClient) {  }
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = sessionStorage.getItem('accessToken'); // Retrieve your token from storage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }
  getUserFileInfo(name: string, email: string, otp: string, purpose: string): Observable<HttpResponse<UserFile>> {
    return this.http.get<UserFile>(`${this.apiUrl}/info?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&purpose=${encodeURIComponent(purpose)}`, { 
      ...this.getHttpOptions(),
      observe: 'response' 
    })
    .pipe(catchError(this.handleError)
    );
  }

  userSession(): Observable<HttpResponse<any>> {
    const options = { 
      observe: 'response' as 'response'
    };
  
    return this.http.get(`${this.apiUrl}/session`, options)
    .pipe(catchError(this.handleError));
  }

async getUserFileInfoAsync1(name: string, email: string): Promise<HttpResponse<UserFile>> {
    try {
        const response = await lastValueFrom(this.http.get<UserFile>(`${this.apiUrl}/info?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`, { 
            // ...this.getHttpOptions(),
            observe: 'response' 
        }));
        return response;
    } catch (error: any) {
      throw error;
      // if (!error.ok) {
      //   throw { status: error.status, message: error.error.message };
      // } else {
      //   throw { status: 500, message: 'Internal Server Error' };
      // }
    }
}

getUserFileInfoAsync(name: string, email: string,fileid:string): Observable<HttpResponse<UserFile>> {
      return this.http.get<UserFile>(`${this.apiUrl}/info?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&fileid=${encodeURIComponent(fileid)}`, { 
          // ...this.getHttpOptions(),
          observe: 'response' 
      }).pipe(
        catchError(this.handleError)
      );
}

isPaymentSuccessful(fileId: string, userEmail: string): Observable<boolean> {
  return this.http.get<any>(`${this.apiUrl}/info?name=verifypayment&email=${encodeURIComponent(userEmail)}&fileid=${encodeURIComponent(fileId)}`).pipe(
    map((response: any) => response.status === 'success' && response.data === true),
    catchError((error) => {
      console.error('Payment status check failed:', error);
      return of(false); // Default to false on error
    })
  );
}

  emailFileInfo(obj:any){
    return this.http.post(`${this.apiUrl}/emailfile`, obj, {
      // ...this.getHttpOptions(),
      observe: 'response'
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  insertUserFileInfo(obj: any): Observable<HttpResponse<UserFile>> {
    return this.http.post<any>(`${this.apiUrl}/insert`, obj, {
      // ...this.getHttpOptions(),
      observe: 'response'
    })
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
    return throwError(error);
  }

}
