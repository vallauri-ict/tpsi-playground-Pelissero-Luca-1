import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private REST_API_SERVER = 'http://localhost:3000/';


  constructor(private httpClient: HttpClient) { }

  public sendGetRequest(endpoint: string) {
    return this.httpClient.get(this.REST_API_SERVER + endpoint);
  }

  public sendPosthtRequest(
    endpoint: string,
    data: any,
  ) {
    return this.httpClient.post(this.REST_API_SERVER + endpoint, data);
  }

  public sendPatchtRequest(
    endpoint: string,
    data: any,
  ) {
    return this.httpClient.patch(this.REST_API_SERVER + endpoint, data);
  }
  
  public sendDeleteRequest(endpoint: string) {
    return this.httpClient.delete(this.REST_API_SERVER + endpoint);
  }
}
