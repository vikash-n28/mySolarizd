import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { YOUTUBE_API_KEY } from '../constants';


@Injectable()
export class YoutubeApiService {
    base_url: string = 'https://www.googleapis.com/youtube/v3/';
    max_results: number = 50;

    public nextToken: string;
    public lastQuery: string;

    constructor(private http: Http){}

    searchVideos(query: string): Promise<any>{
        return this.http.get(this.base_url + 'search?q=' + query + '&maxResults=' + this.max_results + '&type=video&part=snippet,id&key=' + YOUTUBE_API_KEY + '&videoEmbeddable=true')
        .map(response => {
            let jsonRes = response.json();
            let res = jsonRes['items'];
            this.lastQuery = query;

            let ids = [];

            res.forEach((item) => {
                ids.push(item.id.videoId);
            });
            
            return this.getVideos(ids);
        })
        .toPromise()
        // .catch(this.handleError)
    }

    getVideos(ids): Promise<any> {
        return this.http.get(this.base_url + 'videos?id=' + ids.join(',') + '&maxResults=' + this.max_results + '&type=video&part=snippet,contentDetails,statistics&key=' + YOUTUBE_API_KEY)
        .map(results => {
            return results.json()['items'];
        })
        .toPromise()
    }
}