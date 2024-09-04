import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { FilesService } from '../../../core/services/files/files.service';
// import Razorpay from 'razorpay';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { FileExtractionService } from '../../../core/services/file-extraction/file-extraction.service';
import { CheckoutComponent } from '../../payment/checkout/checkout.component';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { LoaderComponent } from "../../../core/components/loader/loader.component";
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { firstValueFrom } from 'rxjs';

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
  fileId : string | null = null;
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
    this.router.navigate(['/files/category/thumbnail-design']);
  }

  async ngOnInit():Promise<void> {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // If the page is refreshed or the route changes, get fileName from router
        this.fileId = this.route.snapshot.paramMap.get('id');
      }
    });

    this.fileId = this.route.snapshot.paramMap.get('id');
  
    if(this.fileId){
      await this.loadFileInfo(this.fileId);
    }
    else{
      this.file = this.fileService.getCurrentFile();
    }
    
    this.dummyData();

    if (!this.file) {
      this.router.navigate(['/not-found']);
    }

    this.file.title = this.file.originalfilename;
    this.file.description = "This is a sample file description.";
    this.loaderService.show();

    this.fileService.getSampleFiles(this.file.filename).subscribe({
      next: (res:any) => {
          res.data.forEach((element: any) => {
            this.file.sampleFiles.push({src:element});
          });
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      }
    });

    this.loaderService.hide();
  }

  async loadFileInfo(fileId: string): Promise<void> {
    try {
      const fileData:any = await firstValueFrom(this.fileService.getFileInfo(fileId));
      this.file = fileData[0];
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }
  

  dummyData(){
    const temp : any = [
      {
          "_id": "66be552737eea6451f93dbb6",
          "originalfilename": "Thumbnail 1.zip",
          "filename": "1722615055131-842584082-Thumbnail 1.zip",
          "dirpath": "C:\\fs\\fsa1\\DeliveryFiles\\files",
          "samplefilesdirpath": "C:\\fs\\fsa1\\DeliveryFiles\\1722615055131-842584082-Thumbnail 1.zip",
          "size": "0.19 MB",
          "mimetype": "application/zip",
          "price": 199,
          "isDeleted": false,
          "sampleFiles": [],
          "updatedAt": "2024-08-15T19:21:11.615Z",
          "__v": 0
      },
      {
          "_id": "66be552d37eea6451f93dbb8",
          "originalfilename": "Thumbnail 3.zip",
          "filename": "1722615110766-251919116-Thumbnail 3.zip",
          "dirpath": "C:\\fs\\fsa1\\DeliveryFiles\\files",
          "samplefilesdirpath": "C:\\fs\\fsa1\\DeliveryFiles\\1722615110766-251919116-Thumbnail 3.zip",
          "size": "0.19 MB",
          "mimetype": "application/zip",
          "price": 0,
          "isDeleted": false,
          "sampleFiles": [],
          "updatedAt": "2024-08-15T19:21:17.757Z",
          "__v": 0
      }
  ];

    this.file = temp.filter((x:any)=>x._id == this.fileId)[0];
    let i = 4;
    while(i>0){
      this.file.sampleFiles.push({src:"assets/defaultsample/Untitled-1.png"});
      i--;
    }
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

  verifyPayment() {
    console.log('Verify payment logic goes here');
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