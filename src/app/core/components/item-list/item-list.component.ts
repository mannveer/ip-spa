import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {
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

  closePopup() {
    this.isVisible = false;
    this.close.emit();
  }
}
