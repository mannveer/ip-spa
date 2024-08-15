import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  apiUrl = 'http://localhost:3000/api/v1/file';
  currentFile: CustomFileModel | null = null;
  constructor(private http: HttpClient) {  }

  setCurrentFile(file: CustomFileModel): void {
    this.currentFile = file;
  }

  getCurrentFile(): CustomFileModel | null {
    return this.currentFile;
  }

  getPreviewUrl(fileName:string):string{
    return `${this.apiUrl}/file-preview/${fileName}`
  }

  getFilesInfo(): Observable<CustomFileModel[]> {
    return this.http.get<CustomFileModel[]>(`${this.apiUrl}/details`);
  }

  getFileInfo(id: string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/details/${id}`);
  }

  getFile(name: string, type:string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/dir/${name}/${type}`);
  }

  downloadFile(fileName: string,fileType: string): void {
    const url = `${this.apiUrl}/dir/${fileName}/${fileType}`;
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    }, (error) => {
      console.error('File download failed:', error);
    });
  }

  getFileDetails(fileId: string): Observable<CustomFileModel> {
    return this.http.get<CustomFileModel>(`${this.apiUrl}/details/${fileId}`);
  }
  // downloadFile(name: string): void {
  //   this.http.get(`${this.apiUrl}/dir/${name}`, {responseType: 'blob' as 'json'}).subscribe((response:any) => {
  //     const contentDispositionHeader = response.headers.get('Content-Disposition');
  //     const fileName = this.getFileNameFromContentDisposition(contentDispositionHeader) || name;
  //     const blob = new Blob([response.body], {type: response.body.type});
  //     const url = window.URL.createObjectURL(blob);
  //     const anchor = document.createElement('a');
  //     anchor.href = url;
  //     anchor.download = fileName;
  //     anchor.click();
  //     window.URL.revokeObjectURL(url);
  //   }, (error: any) => {
  //     console.error('Error downloading file:', error);
  //   });
  // }

  // private getFileNameFromContentDisposition(contentDisposition: string): string | null {
  //   if (contentDisposition) {
  //     const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
  //     const matches = fileNameRegex.exec(contentDisposition);
  //     if (matches != null && matches[1]) {
  //       return matches[1].replace(/['"]/g, '');
  //     }
  //   }
  //   return null;
  // }
}
