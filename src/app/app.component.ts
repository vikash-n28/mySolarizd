import { Component, OnInit,Input } from '@angular/core';
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
      isPause: boolean;
      isPlaylist: boolean;
      isIframe: boolean;
      isRelatedList: boolean;
      playlist: string[];
      videoId: string;

      private player;
      private ytEvent;
      private last_search: string;
      
      @Input() playPauseEvent


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
            this.isPause = true;
            this.isPlaylist = false;
            this.isIframe = false;
            this.isRelatedList = false;
            this.playlist = [];
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
                  });
      }

      convertYouTubeDuration(duration: any) {
            var extracted = time_extractor.exec(duration);
            var hours = parseInt(extracted[1], 10) || 0;
            var minutes = parseInt(extracted[2], 10) || 0;
            var seconds = parseInt(extracted[3], 10) || 0;
            return (hours + ':' + minutes + ':' + seconds).toString();

      }

      selectVideo(video: any) {
            console.log('Playlist',this.playlist);
            this.playlist.push(video);
            if (this.playlist.length > 0) {
                  this.YoutubePlayer.playVideo(video.id, video.snippet.title);
                  this.isPlaylist = true;
                  this.isIframe = true;
            }
      }

      playPause(event: string): void {
            console.log(this.playPauseEvent);
            event === 'pause' ? this.isPause = false:this.isPause = true;
		event === 'pause' ? this.YoutubePlayer.pausePlayingVideo(): this.YoutubePlayer.playPausedVideo();
	}
}

interface ItemsResponse {
      results: string[];
}
