import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenMgrService } from '../shared/services/token-mgr.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  username: string = '';
  private starContainer: HTMLElement | null = null;

  constructor(private tokenMgr: TokenMgrService, private router: Router) {}

  ngOnInit() {
    this.tokenMgr.tokenNotifier$.asObservable().subscribe({
      next: (data) => {
        this.loggedIn = true;
        this.username = this.tokenMgr.getUsername();
      },
      error: (err) => {
        console.log('Error');
      },
    });
    if (this.tokenMgr.isLoggedIn()) {
      this.tokenMgr.notifyIGotToken();
    }
  }

  logOut() {
    this.tokenMgr.deleteToken();
    this.loggedIn = false;
    this.username = '';
    this.router.navigateByUrl('/home');
  }
}
