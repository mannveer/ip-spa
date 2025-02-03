import { Component, OnInit,ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CustomFileModel } from '../../../shared/models/custom-file/custom-file.model';
import { FilesService } from '../../../core/services/files/files.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-available-files',
    imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCheckboxModule,
],
    providers: [provideNativeDateAdapter()],
    templateUrl: './available-files.component.html',
    styleUrls: ['./available-files.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvailableFilesComponent implements OnInit {

  searchSuggestions: CustomFileModel[] = [];
  isLoading: boolean = true; 
  currentDate: Date = new Date();
  files: CustomFileModel[] = [];
  filteredFiles: CustomFileModel[] = [];
  searchQuery: string = '';
  showSuggestions: boolean = false;
  showFilters: boolean = false;
  // @Input({ transform: Boolean }) hideSingleSelectionIndicator = false;
  selectedDesignType: string = '';
  filterCriteria:any = {
    price: [],
    type: [],
    dateRange: { start: null, end: null },
  };
  priceOptions: number[] = [];
  typeOptions: string[] = [];
  noFiles: boolean = false;
  readonly addedDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  
  constructor(
    private router: Router,
    private filesService: FilesService
  ) {}

  ngOnInit(): void {
    this.filesService.getFilesInfo().subscribe({
      next: (filesData: CustomFileModel[]) => {
        this.files = filesData;
        this.filteredFiles = filesData;
        if(!environment.cloudinary)
        this.loadPreviews();
        this.populateFilterOptions();
      },
      error: (error: any) => {
        this.noFiles = true;
        console.error('An error occurred:', error);
      }
    });

    // this.dummyData()
    if(this.files.length === 0){
      this.noFiles = true;
    }

  }

  goBack() {
    this.router.navigate(['/']);
  }
  fetchFiles(): void {
    this.isLoading = true;
    this.filesService.getFilesInfo().subscribe({
      next: (filesData: CustomFileModel[]) => {
        this.files = filesData;
        this.filteredFiles = filesData;
        if(!environment.cloudinary)
        this.loadPreviews();
        this.populateFilterOptions(); 
        this.isLoading = false; 
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
        this.isLoading = false; // Disable loading state even if error occurs
      }
    });
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
  this.filteredFiles = temp; 
  this.loadPreviews();
  this.populateFilterOptions();
  }

  populateFilterOptions(): void {
    const prices = new Set<number>();
    const types = new Set<string>();

    this.files.forEach(file => {
      prices.add(file.price);
      types.add(file.mimetype);
    });

    this.priceOptions = Array.from(prices).sort((a, b) => a - b);
    this.typeOptions = Array.from(types);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredFiles = this.files;
    this.showSuggestions = false;
  }

  applyFilters() {
    this.searchQuery = '';
    this.filteredFiles = this.files.filter((file) => {
      // Filter by price
      const priceFilter =
        this.filterCriteria.price.length === 0 ||
        this.filterCriteria.price.includes(file.price === 0 ? 'Free' : file.price);

      // Filter by type
      const typeFilter =
        this.filterCriteria.type.length === 0 ||
        this.filterCriteria.type.includes(file.mimetype);

      // Filter by date range
      const dateRange = this.addedDateRange.value;
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;
      const fileDate = new Date(file.updatedAt as Date);
  
      const dateFilter =
        (!startDate || fileDate >= startDate) &&
        (!endDate || fileDate <= endDate) || (!startDate && !endDate);
  
      this.showFilters=false;
      return priceFilter && typeFilter && dateFilter;
    });
  }


  isChecked(filterKey: 'price' | 'type'): boolean {
    const value = filterKey==='price'?this.priceOptions:this.typeOptions;
    return value.length>0 && this.filterCriteria[filterKey].length === value.length
  }

  partiallyComplete(filterKey: 'price' | 'type'): boolean {
    const value = filterKey==='price'?this.priceOptions:this.typeOptions;
    return value.length > 0 && this.filterCriteria[filterKey].length > 0 && this.filterCriteria[filterKey].length < value.length
  }

  updateCheckbox(filterKey: 'price' | 'type',options:any[] ,completed:boolean) {
    if (completed) {
      options = filterKey==='price'? options.map(option =>
        filterKey === 'price' && option === 0 ? 'Free' : option
      ):options;
      this.filterCriteria[filterKey] = options;
    } else {
      this.filterCriteria[filterKey] = [];
    }
  };


  onSelectionChange(filterKey: 'price' | 'type', event: any): void {
      this.filterCriteria[filterKey] = event.value;
  }
  
  onSearchInput(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchSuggestions = this.files.filter(file =>
      file.originalfilename.toLowerCase().includes(searchTerm)
    );
    this.showSuggestions = this.searchSuggestions.length > 0; // Show suggestions only if matches found
    this.filteredFiles = this.searchSuggestions; // Display filtered suggestions as results
  }
  

  


  selectSuggestion(file: CustomFileModel): void {
    this.searchQuery = file.originalfilename;
    this.filteredFiles = [file]; // Show only the selected file
    this.showSuggestions = false; // Hide suggestions after selection
  }

  hideSuggestions(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200); 
  }

  openFileDetails(file: CustomFileModel, event: Event): void {
    // if ((event.target as HTMLElement).closest('button')) {
    //   return;
    // }
    this.filesService.setCurrentFile(file);
    this.router.navigate(['/files/file-details', file._id]);
  }

  onBuyAndDownload(file: CustomFileModel, event: Event): void {
    this.openFileDetails(file, event);
    // this.loaderService.show();
    // if (file.price > 0) {
    //   const dialogRef = this.dialog.open(CheckoutComponent, {
    //     width: '400px',
    //     disableClose: true,
    //     data: { file, name: '', email: '', purpose: 'pay', contact: '' }
    //   });
    //   // this.dialog.open(SigninComponent, {
    //   //   width: '400px',
    //   //   disableClose: true,
    //   //   panelClass: 'custom-dialog-container'
    //   // });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //   });
    // } else {
    //   this.filesService.downloadFile(file.filename, 'file');
    //   console.log('Downloading the file...');
    // }
    // this.loaderService.hide();
    // event.stopPropagation();
  }

  loadPreviews(): void {
    this.files.forEach(file => {
      file.previewUrl = this.filesService.getPreviewUrl(file.filename) || 'assets/defaultpreview/Untitled-1.png';
    });
  }
  

  onImageLoad(file: CustomFileModel): void {
    console.log(`Image loaded for file: ${file.originalfilename}`);
  }

  onImageError(file: CustomFileModel): void {
    file.previewUrl = 'assets/defaultpreview/Untitled-1.png'; // Placeholder image in case of error
  }
}
