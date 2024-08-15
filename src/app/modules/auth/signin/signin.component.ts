import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<SigninComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }

  signIn() {
    const loginDetails = {
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:3000/api/v1/auth/signin', loginDetails).subscribe(response => {
      console.log('User signed in successfully', response);
      this.dialogRef.close();
    }, error => {
      console.error('Error during sign in', error);
    });
  }
}
