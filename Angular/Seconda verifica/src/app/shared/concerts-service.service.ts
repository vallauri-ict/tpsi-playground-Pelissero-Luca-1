import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConcertsServiceService {

  constructor(private httpClient: HttpClient) { }

  dettagli:string = ""

  genereSelez:string = ""

  cittaSelez:string = ""
}
