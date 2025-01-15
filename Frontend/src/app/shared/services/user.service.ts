import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = 'http://wd.etsisi.upm.es:10000';
  constructor(private http: HttpClient) {}

  userLogin(username: string, password: string) {
    let querystring = '?username=' + username + '&password=' + password;
    return this.http.get(this.baseUrl + '/users/login' + querystring, {
      observe: 'response',
    });
  }
}
