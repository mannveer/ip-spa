import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-file-zoom-dialog',
    template: `
    <div class="zoom-dialog">
      <img [src]="data.imageSrc" alt="Zoomed Image">
    </div>
  `,
    styles: [`
    .zoom-dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 90vw;
      max-height: 90vh;
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }
  `],
    standalone: false
})
export class FileZoomDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
