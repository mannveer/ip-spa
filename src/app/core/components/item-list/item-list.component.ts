import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-item-list',
    imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule,],
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnChanges {
  @Input() isVisible: boolean = false;

  images = [
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 1' },
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 2' },
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 3' },
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 4' },
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 5' },
    { url: 'https://via.placeholder.com/300x200', alt: 'Sample Image 6' },
  ];

  @Output() close = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  }

  closePopup() {
    this.isVisible = false;
    this.close.emit();
    document.body.classList.remove('modal-open'); // Remove the blur effect when closing
  }
}
