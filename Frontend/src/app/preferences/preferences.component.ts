import { routes } from './../app.routes';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameSettingsServiceService } from '../shared/services/game-settings-service.service';
import { TokenMgrService } from '../shared/services/token-mgr.service';
import { OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css',
})
export class PreferencesComponent implements OnInit {
  username: string = '';
  ufos: number = 1;
  time: number = 60;
  message: string = '';

  constructor(
    private preferencesService: GameSettingsServiceService,
    private tokenMgr: TokenMgrService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.tokenMgr.isLoggedIn()) {
      this.router.navigateByUrl('/login');
      this.toastr.error('You must be logged in to access preferences.');
      return;
    }

    this.tokenMgr.tokenNotifier$.asObservable().subscribe({
      next: (data) => {
        this.username = this.tokenMgr.getUsername();
      },
      error: (err) => {
        console.log('Error');
      },
    });

    this.ufos = parseInt(localStorage.getItem('ufos') || '1');
    this.time = parseInt(localStorage.getItem('time') || '60');
  }

  // Save preferences locally
  saveLocalPreferences() {
    this.preferencesService.setSettings(this.ufos, this.time);
    this.toastr.success('Preferences saved locally!');
  }

  // Save preferences to the server
  saveServerPreferences() {
    this.username = this.tokenMgr.getUsername();
    if (!this.username) {
      this.message = 'Username is not set. Please log in again.';
      this.toastr.error(this.message);
      return;
    }

    this.preferencesService
      .savePreferences(this.username, this.ufos, this.time)
      .subscribe({
        next: (response) => {
          this.message = 'Preferences saved to server!';
          this.toastr.success(this.message);
        },
        error: (error) => {
          this.message = 'Failed to save preferences to server.';
          this.toastr.error(this.message);
        },
      });
  }

  // Retrieve preferences from the server
  getServerPreferences() {
    this.username = this.tokenMgr.getUsername();
    if (!this.username) {
      this.message = 'Username is not set. Please log in again.';
      this.toastr.error(this.message);
      return;
    }
    this.preferencesService.getPreferences(this.username).subscribe({
      next: (response) => {
        this.ufos = response.ufos;
        this.time = response.time;
        this.preferencesService.setSettings(this.ufos, this.time);
        this.message = 'Preferences retrieved from server!';
        this.toastr.success(this.message);
      },
      error: (error) => {
        console.error('Error retrieving preferences from server:', error);
        this.message = 'Failed to retrieve preferences from server.';
        this.toastr.error(this.message);
      },
    });
  }

  startGame() {
    if (localStorage.getItem('ufos') === null) {
      this.message =
        'Preferences not set. Please save preferences before starting the game.';
      this.toastr.error(this.message);
      return;
    }
    this.router.navigateByUrl('/play');
  }
}
