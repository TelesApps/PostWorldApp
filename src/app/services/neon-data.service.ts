import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NeonAPI } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NeonDataService {

  constructor(private http: HttpClient) { }

  getData() {
    // const url = 'https://us-central1-post-world-app.cloudfunctions.net/neon/notifyUser'
    const neonApi = NeonAPI;
    return this.http.get(neonApi + '/getUsers');
  }
}
