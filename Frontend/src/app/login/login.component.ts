import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { TokenMgrService } from '../shared/services/token-mgr.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private userServ: UserService,
    private tokenMgr: TokenMgrService,
    private toastr: ToastrService
  ) {}

  doLogin() {
    this.userServ.userLogin(this.username, this.password).subscribe({
      next: (response) => {
        let token = response.headers.get('Authorization');
        if (token) {
          this.tokenMgr.saveToken(token as string, this.username);
          this.tokenMgr.notifyIGotToken();
          this.goToHome();
          this.toastr.success('Login successful!');
        } else {
          this.toastr.error('Invalid username/password');
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.toastr.error('Invalid username/password');
          this.username = '';
          this.password = '';
        } else {
          this.toastr.error('An unexpected error occurred. Please try again.');
        }
      },
    });
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

  goToHome() {
    this.router.navigateByUrl('/home');
  }
}
