// src/app/core/services/file-extraction/file-extraction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class FileExtractionService {
  apiUrl = 'http://localhost:3000/api/v1/file';
  constructor(private http: HttpClient) { }

  async fetchAndExtractImages(fileName: string, type:string): Promise<string[]> {
    const url = `${this.apiUrl}/dir/${fileName}/${type}`;
    const response = await this.http.get(url, { responseType: 'blob' }).toPromise() as Blob;
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(response);

    const imageUrls: string[] = [];
    for (const fileName of Object.keys(zipContent.files)) {
      if (!zipContent.files[fileName].dir) {
        const fileData = await zipContent.files[fileName].async('blob');
        const objectUrl = URL.createObjectURL(fileData);
        imageUrls.push(objectUrl);
      }
    }
    return imageUrls;
  }
}

