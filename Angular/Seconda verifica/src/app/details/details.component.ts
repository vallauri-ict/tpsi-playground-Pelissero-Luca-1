import { Component, OnInit } from '@angular/core';
import { ConcertsServiceService } from '../shared/concerts-service.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(public service: DataStorageService, public serviceConcert: ConcertsServiceService) { }

  ngOnInit(): void {
  }

}
