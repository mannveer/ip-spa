import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-contact',
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  loader: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  get name():any {
    return this.contactForm.get('name');
  }

  get email():any {
    return this.contactForm.get('email');
  }

  get message():any {
    return this.contactForm.get('message');
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Form Submitted!', formData);
      this.loader = true;
      this.http.post('http://localhost:3000/api/v1/user/send-contact-email', formData).subscribe(
        (response) => {
          console.log('Email sent successfully', response);
          alert(`Thank you, ${formData.name}! Your message has been sent.`);
          this.loader = false;
          this.contactForm.reset();
        },
        (error) => {
          this.loader = false;
          console.error('Error sending email', error);
          alert('There was an error sending your message. Please try again later.');
        }
      );
    }
  }
}
