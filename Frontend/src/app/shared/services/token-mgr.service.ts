import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenMgrService {
  tokenNotifier$: Subject<boolean> = new Subject<boolean>();
  logVariable$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  saveToken(token: string, username: string) {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('username', username);
  }

  getToken() {
    let token = sessionStorage.getItem('authToken');
    if (token) {
      return token;
    } else {
      return 'no token';
    }
  }

  deleteToken() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
  }

  notifyIGotToken() {
    this.tokenNotifier$.next(true);
  }

  getUsername() {
    return sessionStorage.getItem('username') || '';
  }

  notifyLogOut() {
    this.logVariable$.next(true);
  }

  isLoggedIn(): boolean {
    let token = sessionStorage.getItem('authToken');
    if (token) {
      return true;
    } else {
      return false;
    }
  }
}
