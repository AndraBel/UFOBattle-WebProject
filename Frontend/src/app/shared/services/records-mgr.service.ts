import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecordsMgrService {
  private baseUrl = 'http://wd.etsisi.upm.es:10000/records';

  constructor(private http: HttpClient) {}

  getRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
