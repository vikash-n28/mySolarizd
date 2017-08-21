import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
// All the RxJS stuff we need
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class dataService {
    constructor (
        private http: Http
    ){}
    // private postUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&id=UC3LMyMiZpBV2EIvqK6YSyaQ&maxResults=25&key=AIzaSyC4qm4umraWnpUhFvO9ABfZAogs2YIwH7k";
    private postUrl = "./assets/file.json";
    // Make the HTTP request:
    getData():Observable<any>{
        return this.http.get(this.postUrl)
        // ...and calling .json() on the response to return data
         .map((res:Response) => res.json())
         //...errors if any
         .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }


    
}