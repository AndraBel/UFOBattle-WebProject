import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterMgrService {
  baseurl: string = 'http://wd.etsisi.upm.es:10000/users';

  constructor(private http: HttpClient) {}

  checkUser(username: string) {
    return this.http.get(this.baseurl + '/' + username);
  }

  sendUser(username: string, email: string, password: string) {
    const body = { username, email, password };
    const token = sessionStorage.getItem('authToken');
    return this.http.post(this.baseurl, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token || '',
      },
    });
  }
}
