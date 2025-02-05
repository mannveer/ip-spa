import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-signup',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIcon,
        CommonModule
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  hide = true;

  constructor(private renderer: Renderer2, private fb: FormBuilder, private dialogRef: MatDialogRef<SignupComponent>) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // Handle signup logic
      console.log(this.signupForm.value);
      this.closeDialog();
    }
  }

  closeDialog(): void {
    this.renderer.removeClass(document.body, 'no-scroll'); // Re-enable scrolling and reset background
    this.dialogRef.close();
  }
}
