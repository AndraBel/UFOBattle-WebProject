import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TokenMgrService } from '../shared/services/token-mgr.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private router: Router,
    private tokenMgr: TokenMgrService,
    private toastr: ToastrService
  ) {}

  goToPreferences() {
    if (!this.tokenMgr.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.toastr.error('You must be logged in to play the game.');
      return;
    }
    this.router.navigateByUrl('/preferences');
    this.toastr.info('Please select your preferences.');
  }
}
