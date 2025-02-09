import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-success-receipt',
    imports: [],
    templateUrl: './success-receipt.component.html',
    styleUrl: './success-receipt.component.css'
})
export class SuccessReceiptComponent implements OnInit {
  fileId: string;
  fileUrl: string;

  constructor(private route: ActivatedRoute) {
    this.fileId = this.route.snapshot.paramMap.get('fileId') || '';
    this.fileUrl = 'https://example.com/path/to/your/file.zip'; // Example file URL
  }

  ngOnInit(): void {
    this.loadReceiptDetails(this.fileId);
  }

  loadReceiptDetails(fileId: string): void {
    // Logic to load and display receipt details for the given fileId
    console.log('Loading receipt for fileId:', fileId);
  }
  onDownload(): void {
    // Implement any additional logic needed when the download link is clicked
    console.log('File download initiated.');
  }
}
