import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';
import { FilesService } from '../../../core/services/files/files.service';
import { CheckoutComponent } from '../../payment/checkout/checkout.component';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-available-files',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './available-files.component.html',
  styleUrl: './available-files.component.css'
})
  export class AvailableFilesComponent implements OnInit {
    currentDate: Date = new Date();
    files: CustomFileModel[] = [];
  
    constructor(private router: Router,
      private dialog : MatDialog,
      private loaderService: LoaderService,  
      private filesService: FilesService) { }
  
    ngOnInit(): void {
      this.filesService.getFilesInfo().subscribe({
        next: (filesData: CustomFileModel[]) => {
          this.files = filesData;
          this.loadPreviews();
        },
        error: (error: any) => {
          console.error('An error occurred:', error);
        }
      });
    }
  
    openFileDetails(file: CustomFileModel, event: Event): void {
      const target = event.target as HTMLElement;
      if (target.closest('button')) {
        return;
      }
      this.filesService.setCurrentFile(file);
      this.router.navigate(['/files/file-details', file._id]);
    }
  
    onBuyAndDownload(file: CustomFileModel, event: Event): void {
      this.loaderService.show();
      if (file.price > 0) {
        const dialogRef = this.dialog.open(CheckoutComponent, {
          panelClass: 'custom-dialog-container',
          disableClose: true,
          data: { file:file, name: '', email: '',purpose:'pay', contact: '' } // Pass any necessary data
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // Optionally handle any actions after the dialog is closed
        });
      } else {
        // Handle Download action
        this.filesService.downloadFile(file.filename,'file');
        console.log('Downloading the file...');
      }
      this.loaderService.hide();
      event.stopPropagation();
      console.log(`Buying and downloading: ${file.originalfilename}`);
    }
  
    loadPreviews(): void {
      this.files.forEach(file => {
        file.previewUrl = this.filesService.getPreviewUrl(file.filename)
      });
    }
  
    onImageLoad(file: CustomFileModel): void {
      console.log(`Image loaded for file: ${file.originalfilename}`);
    }
  
    onImageError(file: CustomFileModel): void {
      file.previewUrl = 'assets/placeholder.png'; // Placeholder image in case of error
    }
  }
  