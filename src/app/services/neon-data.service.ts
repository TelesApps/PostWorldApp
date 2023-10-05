import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NeonDataService {

  constructor(private http: HttpClient) { }

  getData() {
    const url = 'https://us-central1-post-world-app.cloudfunctions.net/neon/notifyUser'
    return this.http.get(url);
  }
}
