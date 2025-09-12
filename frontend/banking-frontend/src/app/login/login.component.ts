import { Component } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email!: string;
  password!: string
  token!: string;

  constructor(private authService: AuthService) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      {
        next:(response)=>{
          this.token = response.data.login.token;
          console.log("Login successful, token:", this.token);
          
        },
        error:(error)=>{
          console.error("Login failed:", error);
      }
    }
    )
  }
}
