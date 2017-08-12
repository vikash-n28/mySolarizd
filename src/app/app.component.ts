import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'mySolarizd';
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
  // console.log('phone',phone)
}
