import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
    imports: [CommonModule, MatButtonModule],
    template: `
  <div [ngClass]="data.panelClass">
    <span>{{ data.message }}</span>
    <button mat-button (click)="dismiss()">{{ data.action }}</button>
  </div>
`,
    styleUrls: ['./custom-snackbar.component.css']
})
export class CustomSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
  ) {
    console.log('CustomSnackbarComponent - data:', data);
  }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
