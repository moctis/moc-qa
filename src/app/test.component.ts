import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
 
import { FictionLogStorage } from './FictionLogStorage';


@Component({
  selector: 'test',
  templateUrl: './test.component.html',
  styles: [`h1 { font-family: Lato; } a:visited {color:white;} a{color:white}`],
  providers: [FictionLogStorage]
})
export class TestComponent  {
  storage: any;
  newValue: any;

  constructor(private http: HttpClient, public storage: FictionLogStorage) {
    //this.storage = storage2;
  }

  ngOnInit() {
  }

  openDb() {
    this.storage.openDb();
  }
  listDb() {
    this.storage.listDb();
  }
  clear() {
    this.storage.clear();
  }
  add() {
    this.storage.add({
      value: this.newValue
    });
  }
}
