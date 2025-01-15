import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlayMgrService {
  constructor(private http: HttpClient) {}

  getTime(key: string) {
    var time_string: string = localStorage.getItem(key) || '60';
    return parseInt(time_string);
  }

  getUfos(key: string) {
    var ufos_string: string = localStorage.getItem(key) || '1';
    return parseInt(ufos_string);
  }

  recordScore(score: number, ufos: number, time: number) {
    var baseurl: string = 'http://wd.etsisi.upm.es:10000/records';
    const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token || '',
    });

    const data = {
      punctuation: score,
      ufos: ufos,
      disposedTime: time,
    };

    let options = { headers: headers };

    return this.http.post(baseurl, data, options);
  }
}
