import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-userdetails',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './userdetails.component.html',
  styleUrl: './userdetails.component.css'
})
export class UserdetailsComponent implements OnInit {
  user = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email)
  });

  ngOnInit(): void {
    console.log("User details are - ", this.user)
  }

  onSubmit(){
    if(this.user.valid){
      
    }
  }

}
