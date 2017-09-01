import { Component, OnInit, Input, EventEmitter,OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
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
      istimeDuration: boolean;
      previousDisable: boolean;
      nextDisable: boolean;
      playDisable: boolean;
      playlist: string[];
      videoId: string;

      private player;
      private ytEvent;
      public currentVideo;
      public progressBar;
      public timeDuration;
      public volume;
      private last_search: string;

      @Input() playPauseEvent


      constructor(private youtubeService: YoutubeApiService,
            private YoutubePlayer: YoutubePlayerService,
            private sanitizer: DomSanitizer) {}

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
            this.resetInitialValue();
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
            var sec = (seconds < 10)? '0'+ seconds: seconds;
            var min = (minutes < 10)? '0'+minutes:minutes;
            var durationInterval = (hours > 0)? (hours + ':' + min + ':' + sec):(min + ':' + sec);
            return durationInterval.toString();
      }

      // play video on selection
      selectVideo(video: any) {
            this.YoutubePlayer.playVideo(video.id, video.snippet.title);
            if (this.playlist.length > 0) {  
                  for(let i in this.playlist){
                        if(video.id != this.playlist[i])
                              this.playlist.push(video);
                  }
            }else{
                  this.playlist.push(video);  
            }
            this.isPlaylist = true;
            this.isIframe = true;
            this.playDisable = false;
            this.previousDisable = false;
            this.nextDisable = false;
            this.isPlay = false;
            this.currentVideo = video;
            this.playerInfo();
      }

      // delete object from playlist on item selection
      deleteSelection(item: any){
          let index: number = this.playlist.indexOf(item);
          if (index !== -1) {
                this.playlist.splice(index, 1);
          }
          if(this.playlist.length < 1)
            this.resetInitialValue()    
      }
      
      // control play/pause of iframe
      playPause(event: string): void {
            event === 'play' ? this.isPlay = false : this.isPlay = true;
            event === 'pause' ? this.YoutubePlayer.pausePlayingVideo() : this.YoutubePlayer.playPausedVideo();
      }

      previousVideo(): void {
            if(this.playlist.length > 0) {
                  console.log("previousVideo calling....")
            }
      }

      nextVideo(): void {
            if(this.playlist.length > 0) {
                  console.log("nextVideo calling....")
            }  
      }

      volumeSeek(event: any): void{
            this.YoutubePlayer.volumeSeek(event.volume);
            this.playerInfo();
      }

      speakerClick():void {
            console.log("speakerClick calling/.....")
      }

      // update required information of current play
      playerInfo(): void {
            var self = this;
            this.volume = self.YoutubePlayer.volume;
            setInterval(function () {
                  var progressBar = self.YoutubePlayer.updateProgressBar()
                  var timeDuration = self.YoutubePlayer.updateTimerDisplay();
                  if (progressBar) {
                        self.progressBar = progressBar;
                        self.timeDuration = timeDuration
                        self.istimeDuration = true;
                  }
            },1000);
            
      }

      resetInitialValue(): void {
            this.YoutubePlayer.stopCurrentVideo();
            this.isPlaylist = false;
            this.isIframe = false;
            this.istimeDuration = false;
            this.isRelatedList = false;
            this.progressBar = 0;
            this.timeDuration = 0;
            this.playlist = [];
            this.isPlay = true;
            this.playDisable = true;
            this.previousDisable = true;
            this.nextDisable = true;
      }


}

interface ItemsResponse {
      results: string[];
}
