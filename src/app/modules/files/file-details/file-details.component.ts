import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { FilesService } from '../../../core/services/files/files.service';
// import Razorpay from 'razorpay';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';
import { FileExtractionService } from '../../../core/services/file-extraction/file-extraction.service';
import { CheckoutComponent } from '../../payment/checkout/checkout.component';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { LoaderComponent } from "../../../core/components/loader/loader.component";
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';

declare var Razorpay: any;
@Component({
  selector: 'app-file-details',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './file-details.component.html',
  styleUrl: './file-details.component.css',
  animations: [
    trigger('fadeInStagger', [
      transition('* => *', [ // This transition applies to any change in state
        query(':enter', [ // :enter is a shorthand for void => *
          style({ opacity: 0 }), // Initial state of new elements
          stagger('100ms', [ // Stagger the animations, 100ms apart
            animate('600ms ease-out', style({ opacity: 1 })), // Final state of elements
          ]),
        ], { optional: true }) // This is necessary because Angular throws an error if it can't find any elements
      ]),
    ]),
  ]
})
export class FileDetailsComponent {
  selectedImage: any = null;

  file:any ;
  constructor(private route: ActivatedRoute,
    private fileService : FilesService, 
    private router : Router,
    private fes : FileExtractionService,
    private dialog : MatDialog,
    private loaderService: LoaderService
  ) {
    }
  zoomImage(image: any) {
    this.selectedImage = image;
  }

  closeZoom() {
    this.selectedImage = null;
  }
  goBack() {
    this.router.navigate(['/files']);
  }

  ngOnInit(): void {
    const fileId = this.route.snapshot.paramMap.get('id');
    // if (fileId) {

    //   this.fileService.getFileInfo(fileId).subscribe({
    //     next: (fileData: CustomFileModel) => {
    //       this.file = fileData;
    //       this.file = {
    //         title: 'Sample File',
    //         name: 'sample.jpg',
    //         type: 'Image',
    //         size: '5MB',
    //         description: 'This is a sample file description.',
    //         price: 0, // Set to 0 for free images
    //         images: [
    //           { src: 'assets/image1.jpg' },
    //           { src: 'assets/image2.jpg' },
    //           { src: 'assets/image21.jpg' },
    //           { src: 'assets/image22.jpg' },
    //           { src: 'assets/image23.jpg' },
    //           // { src: 'assets/image24.jpg' },
    //           // { src: 'assets/image25.jpg' },
    //           // { src: 'assets/image26.jpg' },
    //           // Add more images as needed
    //         ]
    //       };

    //     this.fes.fetchAndExtractImages(this.file.name,'sample')
    //       .then((extractedImages: any) => {
    //         this.file.images = extractedImages;
    //       })
    //       .catch((error: any) => {
    //         console.error('An error occurred:', error);
    //       });
    //       // fileData.sampleFiles.forEach{}
    //       console.log("File Details: ", this.file);
    //     },
    //     error: (error: any) => {
    //       console.error('An error occurred:', error);
    //     }
    //   });
    // }

    this.file = this.fileService.getCurrentFile();

    if (!this.file) {
      this.router.navigate(['/files']);
    }

    this.file.title = this.file.originalfilename;
    this.file.description = "This is a sample file description.";
    this.loaderService.show();
    this.fes.fetchAndExtractImages(this.file.filename,'sample')
    .then((extractedImages: any) => {
      if(extractedImages.length === 0) {
        extractedImages = [
          { src: 'assets/image1.jpg' }
        ];
      }
      this.file.sampleFiles = extractedImages;
      this.loaderService.hide();
    })
    .catch((error: any) => {
      console.error('An error occurred:', error);
      this.loaderService.hide();
    });
  }


  handleActionClick() {
    this.loaderService.show();
    if (this.file.price > 0) {
      const dialogRef = this.dialog.open(CheckoutComponent, {
        panelClass: 'custom-dialog-container',
        disableClose: true,
        data: { file:this.file, name: '', email: '',purpose:'pay', contact: '' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // Optionally handle any actions after the dialog is closed
      });
    } else {
      // Handle Download action
      this.fileService.downloadFile(this.file.filename,'file');
      console.log('Downloading the file...');
    }
    this.loaderService.hide();
  }

  // handleActionClick() {
  //   this.router.navigate(['/check-out'])
  // }

  verifyPayment() {
    console.log('Verify payment logic goes here');
    // Implement your payment verification logic
    const dialogRef = this.dialog.open(CheckoutComponent, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      data: { file:this.file, name: '', email: '', purpose:'verify', contact: '' } // Pass any necessary data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  contactMe() {
    this.router.navigate(['/contact']);
  }
}