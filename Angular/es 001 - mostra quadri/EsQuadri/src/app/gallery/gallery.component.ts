import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../data-storage.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  artisti: any;
  pictures: any;
  indexPicture: number = 0;
  artist: any

  constructor(public service: DataStorageService) { }

  ngOnInit(): void {
    this.getArtist();
  }

  getArtist() {
    this.service.sendGetRequest('artisti').subscribe(
      data => {
        this.artisti = data as any[];
      },
      error => {
        console.error(error);
      }
    )
  }

  loadPaintings(artista: any) {

    this.service.sendGetRequest('quadri?id=' + artista.id).subscribe(
      data => {
        this.indexPicture = 0;
        this.pictures = data as any[];
        this.artist = artista;
        this.service.artist = artista;
      },
      error => {
        console.error(error);
      }
    )
  }

  increase() {
    this.indexPicture++;
  }

  decrease() {
    this.indexPicture--;
  }

  addLike() {
    let nLike = ++this.pictures[this.indexPicture].nLike;
    this.service.sendPatchtRequest(`quadri?artist=${this.pictures[this.indexPicture].id}`, { "nLike": nLike }).subscribe(
      data => {
        this.indexPicture = 0;
        this.pictures = data as any[];
      },
      error => {
        console.error(error);
      }
    )
  }

  controllaBase64(){
    if (!(this.pictures[this.indexPicture].img).startsWith("data:image/")) {
      return "assets/img/"+this.pictures[this.indexPicture].img
    }
    else{
      return this.pictures[this.indexPicture].img
    }
  }
}
