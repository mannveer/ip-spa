import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserFile } from '../../../shared/models/user-file/user-file.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserFileInfoService {
  apiUrl = 'http://localhost:3000/api/v1/user';
  constructor(private http: HttpClient) {  }
  private getHttpOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken'); // Retrieve your token from storage
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}` // Assuming Bearer token authentication
      })
    };
  }
  getFileInfo(name: string, email: string, otp: string, purpose: string): Observable<HttpResponse<UserFile>> {
    return this.http.get<UserFile>(`${this.apiUrl}/info?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&purpose=${encodeURIComponent(purpose)}`, { 
      ...this.getHttpOptions(),
      observe: 'response' 
    })
    .pipe(catchError(this.handleError)
    );
  }

  emailFileInfo(obj:any){
    return this.http.post(`${this.apiUrl}/enailfile`, obj, {
      ...this.getHttpOptions(),
      observe: 'response'
    })
    .pipe(
      catchError(this.handleError)
    );
  }

  insertUserFileInfo(obj: any): Observable<HttpResponse<UserFile>> {
    return this.http.post<any>(`${this.apiUrl}/insert`, obj, {
      ...this.getHttpOptions(),
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
