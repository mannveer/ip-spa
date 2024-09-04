import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private readonly apiUrl = 'http://localhost:3000/api/v1/file';
  private currentFile: CustomFileModel | null = null;

  constructor(private http: HttpClient) { }

  setCurrentFile(file: CustomFileModel): void {
    this.currentFile = file;
  }

  getCurrentFile(): CustomFileModel | null {
    return this.currentFile;
  }

  getPreviewUrl(fileName: string): string {
    return `${this.apiUrl}/file-preview/${fileName}`;
  }

  getFilesInfo(): Observable<CustomFileModel[]> {
    return this.http.get<CustomFileModel[]>(`${this.apiUrl}/details`)
      .pipe(
        catchError(this.handleError<CustomFileModel[]>('getFilesInfo', []))
      );
  }

  getFileInfo(id: string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/details/${id}`)
      .pipe(
        catchError(this.handleError<CustomFileModel>('getFileInfo'))
      );
  }

  getSampleFiles(filename:string): Observable<Object> {
    return this.http.get<Object>(`${this.apiUrl}/file-sample-url/${filename}`)
      .pipe(
        catchError(this.handleError<Object>('getSampleFiles'))
      );
  }

  getFile(name: string, type: string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/dir/${name}/${type}`)
      .pipe(
        catchError(this.handleError<CustomFileModel>('getFile'))
      );
  }

  downloadFile(fileName: string, fileType: string): void {
    const url = `${this.apiUrl}/dir/${fileName}/${fileType}`;
    this.http.get(url, { responseType: 'blob' })
      .pipe(
        catchError(this.handleError('downloadFile'))
      )
      .subscribe((blob:any) => this.triggerFileDownload(blob, fileName));
  }

  getFileDetails(fileId: string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/details/${fileId}`)
      .pipe(
        catchError(this.handleError<CustomFileModel>('getFileDetails'))
      );
  }

  // Private helper methods
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`Operation ${operation} failed: ${error.message}`));
    };
  }

  private triggerFileDownload(blob: Blob, fileName: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = downloadUrl;
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(downloadUrl);
  }
}
