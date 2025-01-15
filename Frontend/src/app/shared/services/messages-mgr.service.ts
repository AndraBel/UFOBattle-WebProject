import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesMgrService {
  private baseUrl = 'http://wd.etsisi.upm.es:10000/messages';

  constructor(private http: HttpClient) {}

  getLastMessages(token: string): Observable<any[]> {
    // const token = sessionStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    let options = { headers: headers };

    return this.http.get<any[]>(this.baseUrl, options);
  }

  deleteMessages(token: string, username: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token || '',
    });

    let options = { headers: headers };

    return this.http.delete<any>(`${this.baseUrl}/${username}`, options);
  }
}
