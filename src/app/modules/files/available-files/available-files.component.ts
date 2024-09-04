import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';
import { FilesService } from '../../../core/services/files/files.service';
import { CheckoutComponent } from '../../payment/checkout/checkout.component';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'; 
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FeaturedWorkComponent } from "../../personal/featured-work/featured-work.component";


@Component({
  selector: 'app-available-files',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './available-files.component.html',
  styleUrl: './available-files.component.css',
  animations: [
    trigger('filterState', [
      state('collapsed', style({ height: '0px', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', animate('300ms ease-out')),
    ]),
    trigger('suggestionsState', [
      state('hidden', style({ height: '0px', opacity: 0 })),
      state('visible', style({ height: '*', opacity: 1 })),
      transition('hidden <=> visible', animate('300ms ease-out')),
    ]),
  ],

})

export class AvailableFilesComponent implements OnInit {
  currentDate: Date = new Date();
  files: CustomFileModel[] = [];
  filteredFiles: CustomFileModel[] = [];
  searchQuery: string = '';
  showSuggestions: boolean = false;
  showFilters: boolean = false;

  filterCriteria = { price: '', type: '', dateAdded: '', designType: '' };
  priceOptions: number[] = [];
  typeOptions: string[] = [];
  dateOptions: string[] = [];
  designTypeOptions: string[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {
    this.filesService.getFilesInfo().subscribe({
      next: (filesData: CustomFileModel[]) => {
        this.files = filesData;
        this.filteredFiles = filesData; // Initialize filteredFiles with all files
        this.loadPreviews();
        this.populateFilterOptions(); // Populate filter dropdowns
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      }
    });

    this.dummyData()

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

  this.files = temp;
  this.filteredFiles = temp; // Initialize filteredFiles with all files
  this.loadPreviews();
  this.populateFilterOptions(); // Populate filter dropdowns
  }

  populateFilterOptions(): void {
    const prices = new Set<number>();
    const types = new Set<string>();
    const dates = new Set<string>();
    const designTypes = new Set<string>();

    this.files.forEach(file => {
      prices.add(file.price);
      types.add(file.mimetype);
      const updatedAt = file.updatedAt ? new Date(file.updatedAt) : new Date();
      dates.add(new Date(updatedAt).toISOString().split('T')[0]);
      designTypes.add(file.designType);
    });

    this.priceOptions = Array.from(prices).sort((a, b) => a - b);
    this.typeOptions = Array.from(types);
    this.dateOptions = Array.from(dates).sort();
    this.designTypeOptions = Array.from(designTypes);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredFiles = this.files;
    this.showSuggestions = false;
  }

  applyFilters(): void {
    this.filteredFiles = this.files.filter(file => {
      const updatedAt = file.updatedAt ? new Date(file.updatedAt) : new Date();
      return (
        (this.filterCriteria.price === '' || file.price === +this.filterCriteria.price) &&
        (this.filterCriteria.type === '' || file.mimetype === this.filterCriteria.type) &&
        (this.filterCriteria.dateAdded === '' || new Date(updatedAt).toISOString().split('T')[0] === this.filterCriteria.dateAdded) &&
        (this.filterCriteria.designType === '' || file.designType === this.filterCriteria.designType)
      );
    });
    this.showFilters = false; // Hide filters after applying
  }

  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredFiles = this.files.filter(file =>
      file.originalfilename.toLowerCase().includes(searchTerm)
    );
  }

  selectSuggestion(file: CustomFileModel): void {
    this.searchQuery = file.originalfilename;
    this.filteredFiles = [file]; // Show only the selected file
    this.showSuggestions = false; // Hide suggestions after selection
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); // Delay to allow clicks on suggestions
  }

  openFileDetails(file: CustomFileModel, event: Event): void {
    if ((event.target as HTMLElement).closest('button')) {
      return;
    }
    this.filesService.setCurrentFile(file);
    this.router.navigate(['/files/file-details', file._id]);
  }

  onBuyAndDownload(file: CustomFileModel, event: Event): void {
    this.loaderService.show();
    if (file.price > 0) {
      const dialogRef = this.dialog.open(CheckoutComponent, {
        width: '400px',
        disableClose: true,
        data: { file, name: '', email: '', purpose: 'pay', contact: '' }
      });
      // this.dialog.open(SigninComponent, {
      //   width: '400px',
      //   disableClose: true,
      //   panelClass: 'custom-dialog-container'
      // });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      this.filesService.downloadFile(file.filename, 'file');
      console.log('Downloading the file...');
    }
    this.loaderService.hide();
    event.stopPropagation();
  }

  loadPreviews(): void {
    this.files.forEach(file => {
      file.previewUrl = this.filesService.getPreviewUrl(file.filename);
    });
  }

  onImageLoad(file: CustomFileModel): void {
    console.log(`Image loaded for file: ${file.originalfilename}`);
  }

  onImageError(file: CustomFileModel): void {
    file.previewUrl = 'assets/defaultpreview/Untitled-1.png'; // Placeholder image in case of error
  }
}

