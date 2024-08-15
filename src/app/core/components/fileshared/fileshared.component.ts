import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fileshared',
  standalone: true,
  imports: [],
  templateUrl: './fileshared.component.html',
  styleUrl: './fileshared.component.css'
})
export class SuccessReceiptComponent implements OnInit {
  fileUrl: string;

  constructor() {
    // You should dynamically set this URL based on the file purchased
    this.fileUrl = 'https://example.com/path/to/your/file.zip'; // Example file URL
  }

  ngOnInit(): void {}

  onDownload(): void {
    // Implement any additional logic needed when the download link is clicked
    console.log('File download initiated.');
  }

}
