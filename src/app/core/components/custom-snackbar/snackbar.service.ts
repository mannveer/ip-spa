import { Injectable, Inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar.component';

interface SnackbarOptions {
  message: string;
  action?: string;
  duration?: number;
  panelClass?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  openSnackBar1(options: SnackbarOptions) {
    console.log('openSnackBar - options:', options);
    const config: MatSnackBarConfig = {
      data: {
        message: options.message,
        action: options.action || 'Dismiss',
        panelClass: options.panelClass || 'custom-snackbar',
      },
      duration: options.duration || 3000,
      panelClass: options.panelClass || 'custom-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };

    this.snackBar.openFromComponent(CustomSnackbarComponent, config);
  }

  openSnackBar(options: SnackbarOptions) {
    console.log('openSnackBar - options:', options);
    const config: MatSnackBarConfig = {
      duration: options.duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    };

    this.snackBar.open(options.message, options.action || 'Dismiss', config);
  }
}
