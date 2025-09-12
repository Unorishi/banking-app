import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email!: string;
  password!: string;
  name!: string;
  token!: string;

  constructor(private authService: AuthService) {}

  onSubmit() {
  this.authService.signup(this.email, this.password, this.name).subscribe({
    next: (response) => {
      console.log('Signup successful:', response.data.createUser);
      // You can redirect to login page here
    },
    error: (error) => {
      console.error('Signup failed:', error);
    }
  });
}

}
