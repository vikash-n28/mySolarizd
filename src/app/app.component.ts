import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
      results: string[];
      isPlay: boolean;
      isPlaylist: boolean;
      isIframe: boolean;
      isRelatedList: boolean;
      playlist: string[];
      videoId: string;

      private player;
      private ytEvent;
      private last_search: string;



      constructor(private youtubeService: YoutubeApiService,
            private YoutubePlayer: YoutubePlayerService,
            private sanitizer: DomSanitizer) { }

      //onModelChnage getting data
      searchData(dataObject): void {
            if (dataObject.dataSearch.length > 0) {
                  this.last_search = dataObject.dataSearch;
                  this.youtubeService.searchVideos(this.last_search)
                        .then(data => {
                              if (data) {
                                    var dataArray = data;
                                    for (var i = 0; i < dataArray.length; i++) {
                                          if (dataArray[i].contentDetails.duration) {
                                                var duration = this.convertYouTubeDuration(dataArray[i].contentDetails.duration);
                                                dataArray[i].contentDetails.duration = duration;
                                          }
                                    }
                                    if (dataArray.length > 0)
                                          this.results = dataArray;
                              }
                        })
            }
      }


      ngOnInit(): void {
            this.isPlay = true;
            this.isPlaylist = false;
            this.isIframe = false;
            this.isRelatedList = false;
            this.playlist = [];
            // this.YoutubePlayer.createPlayer();
            // this.createiFramePlayer();
            this.youtubeService.searchVideos('')
                  .then(data => {
                        if (data) {
                              var dataArray = data;
                              if (dataArray.length > 0) {
                                    for (var i = 0; i < dataArray.length; i++) {
                                          if (dataArray[i].contentDetails.duration) {
                                                var duration = this.convertYouTubeDuration(dataArray[i].contentDetails.duration);
                                                dataArray[i].contentDetails.duration = duration;
                                          }
                                    }
                                    if (dataArray.length > 0)
                                          this.results = dataArray;
                              }

                        }
                  })
      }

      convertYouTubeDuration(duration: any) {
            var extracted = time_extractor.exec(duration);
            var hours = parseInt(extracted[1], 10) || 0;
            var minutes = parseInt(extracted[2], 10) || 0;
            var seconds = parseInt(extracted[3], 10) || 0;
            return (hours + ':' + minutes + ':' + seconds).toString();

      }

      selectVideo(video: any) {
            console.log(this.playlist);
            this.playlist.push(video);
            console.log('video', video);
            if (this.playlist.length > 0) {

                  this.createiFramePlayer().then(res => {
                        if (res) {
                              console.log("selectVideo calling...")
                              this.YoutubePlayer.playVideo(video.id, video.snippet.title);
                              this.isPlaylist = true;
                              this.isIframe = true;
                        }

                  })
            }

      }


      createiFramePlayer(): Promise<boolean> {
            return new Promise<boolean>((resolve, reject) => {
                  let doc = window.document;
                  let playerApi = doc.createElement('script');
                  playerApi.type = 'text/javascript';
                  playerApi.src = 'https://www.youtube.com/iframe_api';
                  doc.body.appendChild(playerApi);
                  this.YoutubePlayer.createPlayer().then(res => {
                        if (res)
                        resolve(true);
                        console.log("createiFramePlayer calling...")
                  })
            });
      };
}

interface ItemsResponse {
      results: string[];
}
