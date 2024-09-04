import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signinForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SigninComponent>,
    private renderer: Renderer2
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.renderer.addClass(document.body, 'no-scroll'); // Disable scrolling and blur background
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      console.log('Form Submitted:', this.signinForm.value);
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.renderer.removeClass(document.body, 'no-scroll'); // Re-enable scrolling and reset background
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'no-scroll'); // Ensure reset on component destroy
  }
}
