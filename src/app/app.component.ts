import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { dataService } from './app.service'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
      results: string[];
      errorMessage: string;
      constructor(private dataService: dataService, private http: Http) { }
      ngOnInit(): void {
            //  this.dataService.getData().subscribe(data => this.results = data);
            // Make the HTTP request:
            var serverUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&id=UC3LMyMiZpBV2EIvqK6YSyaQ&maxResults=25&key=AIzaSyC4qm4umraWnpUhFvO9ABfZAogs2YIwH7k';
            var jsonUrl = './assets/file.json';
            this.http.get(jsonUrl)
                  .map(res => res.json())
                  .subscribe(data => {
                        // Read the result field from the JSON response.
                        if (data) {
                              if (data.items.length) {
                                    for (var i = 0; i < data.items.length; i++) {
                                          if (data.items[i].contentDetails.duration) {
                                                var duration = this.convertYouTubeDuration(data.items[i].contentDetails.duration);
                                                data.items[i].contentDetails.duration = duration;
                                          }
                                    }
                              }
                              this.results = data;
                              console.log(this.results)
                        }
                  });
      }

      //onBlur getting data
      searchData(dataObject, event) {
            event.preventDefault();
            console.log(dataObject.dataSearch)
      }

      convertYouTubeDuration(duration) {
            var extracted = time_extractor.exec(duration);
            var hours = parseInt(extracted[1], 10) || 0;
            var minutes = parseInt(extracted[2], 10) || 0;
            var seconds = parseInt(extracted[3], 10) || 0;
            return (hours + ':' + minutes + ':' + seconds).toString();

      }
}

interface ItemsResponse {
      results: string[];
}
