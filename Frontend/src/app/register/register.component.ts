import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterMgrService } from '../shared/services/register-mgr.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  message: string = '';
  validUsername: boolean = false;
  usernameWarning: boolean = false;

  constructor(
    private registerService: RegisterMgrService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  validateUsername() {
    if (this.username.length > 8) {
      this.usernameWarning = true;
    } else {
      this.usernameWarning = false;
    }
  }

  checkUsername() {
    if (this.usernameWarning) {
      this.validUsername = false;
      return; // Skip the server check
    }

    this.registerService.checkUser(this.username).subscribe({
      next: (response) => {
        this.message = 'The username already exists. Pleas try another one.';
        this.toastr.warning(this.message);
        this.validUsername = false;
      },
      error: (error) => {
        if (error.status == 404) {
          if (!this.usernameWarning) {
            this.validUsername = true;
            this.toastr.success('The username is available');
          }
        } else if (error.status == 500) {
          this.message = 'Error: Internal server error';
          this.toastr.error(this.message);
          this.validUsername = false;
        }
      },
    });
  }

  onRegister() {
    if (!this.email.trim() || !this.password.trim()) {
      this.toastr.warning('Please complete all fields before registering.');
      return;
    }

    this.registerService
      .sendUser(this.username, this.email, this.password)
      .subscribe({
        next: (response) => {
          this.toastr.success('Registration successful! Please log in.');
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          if (error.status == 409) {
            this.toastr.error(
              'The username already exists. Please try another one.'
            );
          } else if (error.status == 500) {
            this.toastr.error('Internal server error. Please try again.');
          } else if (error.status == 400) {
            this.toastr.error('Invalid data. Please try again.');
          }
          this.toastr.error('An unexpected error occurred. Please try again.');
        },
      });

    // Clear fields after successful registration
    this.username = '';
    this.email = '';
    this.password = '';
    this.validUsername = false;
  }
}
