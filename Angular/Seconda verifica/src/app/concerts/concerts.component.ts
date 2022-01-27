import { Component, OnInit } from '@angular/core';
import { ConcertsServiceService } from '../shared/concerts-service.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-concerts',
  templateUrl: './concerts.component.html',
  styleUrls: ['./concerts.component.css']
})
export class ConcertsComponent implements OnInit {

  concerti:any

  constructor(public service: DataStorageService, public serviceConcert: ConcertsServiceService) { }

  ngOnInit(): void {
    this.getDatiConcerti()
  }

  getDatiConcerti(){
    this.service.sendGetRequest('concerti').subscribe(
      data => {
        console.log(data)
        this.concerti= data as any[];
      },
      error => {
        console.error(error);
      }
    )
  }

  dettagli(dettagli: string){
    this.serviceConcert.dettagli=dettagli;
  }

  prenota(idConcerto: any){
    
  }

}
