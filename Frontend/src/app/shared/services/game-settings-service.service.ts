import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsServiceService {
  private baseUrl = 'http://localhost:3000/preferences';

  constructor(private http: HttpClient) {}

  setSettings(ufos: number, time: number) {
    localStorage.setItem('ufos', ufos.toString());
    localStorage.setItem('time', time.toString());
  }

  // Save preferences to the server
  savePreferences(
    username: string,
    ufos: number,
    time: number
  ): Observable<any> {
    this.setSettings(ufos, time);
    const body = { username, ufos, time };
    return this.http.post(this.baseUrl, body);
  }

  // Retrieve preferences from the server
  getPreferences(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${username}`);
  }
}
