import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private dialogRef: MatDialogRef<SignupComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }

  signUp() {
    const userDetails = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:3000/api/v1/auth/signup', userDetails).subscribe(response => {
      console.log('User signed up successfully', response);
      this.dialogRef.close();
    }, error => {
      console.error('Error during sign up', error);
    });
  }
}
