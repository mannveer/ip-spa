import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface File {
  id: number;
  name: string;
  type: string;
  url: string;
}

@Component({
    selector: 'app-filetemp',
    templateUrl: './filetemp.component.html',
    imports: [CommonModule, RouterModule],
    styleUrl: './filetemp.component.css'
})
export class FiletempComponent {
  currentDate: Date = new Date();

  files: File[] = [
    { id: 0, name: 'Document.pdf', type: 'pdf', url: 'path/to/document.pdf' },
    { id: 1, name: 'Archive.zip', type: 'zip', url: 'path/to/archive.zip' },
    { id: 2, name: 'Image.jpg', type: 'image', url: 'path/to/image.jpg' },
    // Add more files as needed
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openFileDetails(file: any): void {
    this.router.navigate(['/files/file-details', file.name]);
  }

  onBuyAndDownload(file: File): void {
    console.log(`Buying and downloading: ${file.name}`);
    // Example: navigate to a purchase page or trigger a download
  }
}
