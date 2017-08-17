import { Component, OnInit } from '@angular/core';
import { FormControl, Validators} from '@angular/forms';
// import {Http, HTTP_PROVIDERS} from '@angular/http';
import 'rxjs/add/operator/map';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
//   viewProviders: [HTTP_PROVIDERS],
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  results: string[]; 

  phone = [{
        id: 1,
        name: 'Rajesh'
  },
  {
        id: 2,
        name: 'Raju'
  },
  {
        id: 3,
        name: 'Ramesh'
  }];
//   constructor(private http: Http){}
  ngOnInit(): void{
       // Make the HTTP request:
//      this.http.get('/api/items').subscribe(data => {
       // Read the result field from the JSON response.
      //  this.results = data['results'];
//      });       
  }

  // console.log('phone',phone)
  searchData(data,event){
      event.preventDefault();
      console.log(data.dataSearch)
  }
}

interface ItemsResponse {
      results: string[];
    }
