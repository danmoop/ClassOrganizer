import { Component, ViewChild, ElementRef } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ClassOrganizer';
  items = [];
  
  str = "";
  
  ngOnInit() {
    this.getItems();
  }

  add() {
    if(this.str) {
      axios.post('http://localhost:1337/add', {data: this.str}).then(items => this.items = items.data);
      this.str = "";
    }
  }

  remove(item) {
    if(item) {
      axios.post('http://localhost:1337/remove', {data:item}).then(items => this.items = items.data);
    }
  }

  getItems()
  {
    axios.get('http://localhost:1337/list')
      .then(items => this.items = items.data);
  }
}