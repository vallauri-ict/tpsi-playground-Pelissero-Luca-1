import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConcertsServiceService } from '../shared/concerts-service.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  citta: any;
  generi: any;
  genereSelez: string = ''
  cittaSelez: string = ''

  constructor(public service: DataStorageService, public serviceConcert: ConcertsServiceService) { }

  ngOnInit(): void {
    this.caricaComboCitta()
    this.caricaComboGeneri()
  }
  caricaComboCitta() {
    this.service.sendGetRequest('citta').subscribe(
      data => {
        this.citta = data as any[];
      },
      error => {
        console.error(error);
      }
    )
  }

  caricaComboGeneri() {
    this.service.sendGetRequest('generi').subscribe(
      data => {
        this.generi = data as any[];
      },
      error => {
        console.error(error);
      }
    )
  }

  clickCitta(citta: string) {
    this.cittaSelez = citta
  }

  clickGeneri(genere: string) {
    this.genereSelez = genere
  }

  filtra(){
    this.serviceConcert.cittaSelez=this.cittaSelez
    this.serviceConcert.genereSelez = this.genereSelez
  }

}
