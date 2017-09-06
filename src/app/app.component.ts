import { Component, OnInit, Input, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { AuthService, AppGlobals } from 'angular2-google-login';
import 'rxjs/add/operator/map';

//Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';

import { MdSnackBar } from '@angular/material';


//model
import { VideoModel } from './shared/model/video';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const time_extractor = /([0-9]*H)?([0-9]*M)?([0-9]*S)?$/;
declare const gapi: any;



@Component({
      selector: 'google-signin',
      templateUrl: './googleSignIn.component.html',
      styleUrls: ['./app.component.css']
})
export class GoogleSigninComponent implements AfterViewInit {
      public isSignIn: boolean = true;
      public profile;
      private clientId: string = '93547708661-j3ndsutofjvaf3ngj66bjfjlht7kvng5.apps.googleusercontent.com';
      private scope = [
            'profile',
            'email',
            'https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/contacts.readonly',
            'https://www.googleapis.com/auth/admin.directory.user.readonly'
      ].join(' ');
      public auth2: any;
      constructor(private element: ElementRef) {
            console.log('ElementRef: ', this.element);
      }

      public googleInit() {
            let that = this;
                  gapi.load('auth2', function () {
                        that.auth2 = gapi.auth2.init({
                              client_id: that.clientId,
                              cookiepolicy: 'single_host_origin',
                              response_type: 'id_token permission',
                              scope: that.scope
                        });
                        that.attachSignin(that.element.nativeElement.firstChild);
                  });  
      }

      public attachSignin(element) {
            let that = this;
            this.auth2.attachClickHandler(element, {},
                  function (googleUser) {
                        if (!that.profile) {
                              that.profile = googleUser.getBasicProfile();
                              // console.log('Token || ' + googleUser.getAuthResponse().id_token);
                              // console.log('ID: ' + that.profile.getId());
                              // console.log('Name: ' + that.profile.getName());
                              // console.log('Image URL: ' + that.profile.getImageUrl());
                              // console.log('Email: ' + that.profile.getEmail());
                              //YOUR CODE HERE
                              localStorage.setItem('token', googleUser);
                              localStorage.setItem('id_token', googleUser.getAuthResponse().id_token);
                              localStorage.setItem('profile', JSON.stringify(that.profile));
                              console.log("localStorage",localStorage);
                              (that.isSignIn) ? that.isSignIn = false : that.isSignIn = true;
                        } else {
                              var auth2 = gapi.auth2.getAuthInstance();
                              auth2.signOut().then(function () {
                                    console.log('User signed out.');
                                      localStorage.removeItem('token');
                                      localStorage.removeItem('id_token');
                                      localStorage.removeItem('profile');
                                      console.log('localStorage',localStorage);
                                      
                              });
                              gapi.auth2.getAuthInstance().disconnect();
                              (that.isSignIn) ? that.isSignIn = false : that.isSignIn = true;
                        }


                  }, function (error) {
                        console.log(JSON.stringify(error, undefined, 2));
                  });
                  
      }

      ngAfterViewInit() {
             this.googleInit();
      }
}

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
      results: ItemsResponse[];
      playlist: videoObject[];
      isPlay: boolean;
      isPlaylist: boolean;
      isIframe: boolean;
      isRelatedList: boolean;
      istimeDuration: boolean;
      isSpeaker: boolean;
      previousDisable: boolean;
      nextDisable: boolean;
      playDisable: boolean;
      videoId: string;


      private player;
      private ytEvent;
      public currentVideo;
      public progressBar;
      public timeDuration;
      public volume;
      private last_search: string;
      public auth2: any;

      @Input() playPauseEvent

      // @HostListener("click", ["$event"])
      // public selectVideo(event: any): void
      // {
      //     event.stopPropagation();
      // }

      constructor(private youtubeService: YoutubeApiService,
            private YoutubePlayer: YoutubePlayerService,
            public snackBar: MdSnackBar,
            private sanitizer: DomSanitizer) {
      }


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
            AppGlobals.GOOGLE_CLIENT_ID = '93547708661-j3ndsutofjvaf3ngj66bjfjlht7kvng5';
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
            var sec = (seconds < 10) ? '0' + seconds : seconds;
            var min = (minutes < 10) ? '0' + minutes : minutes;
            var durationInterval = (hours > 0) ? (hours + ':' + min + ':' + sec) : (min + ':' + sec);
            return durationInterval.toString();
      }

      // play video on selection
      selectVideo(event: any, item: any) {
            // console.log('video', event,item);
            if (item) {
                  var isAvail = false;
                  event.stopPropagation();
                  item.isPlay = true;
                  if (!this.currentVideo) {
                        item.isPlay = false;
                        item.timeDuration = true;
                        this.currentVideo = item;
                        this.YoutubePlayer.playVideo(item.id, item.snippet.title);
                  }
                  if (this.playlist.length > 0) {
                        this.nextDisable = false;
                        for (let i = 0; i < this.playlist.length; ++i) {
                              if (item.id === this.playlist[i].id) {
                                    isAvail = true;
                              }
                        }
                  }
                  if (!isAvail){
                        this.playlist.push(item);
                        this.snackBar.open(item.snippet.title, 'Added', {
                              duration: 1000,
                        });
                  }else{
                        this.snackBar.open(item.snippet.title, 'Already Added', {
                              duration: 1000,
                        });  
                  }   
                  this.isPlaylist = true;
                  this.isIframe = true;
                  this.playDisable = false;
                  this.isPlay = false;
                  this.playerInfo();
                  console.log('video', this.playlist);
            }
      }

      // delete object from playlist on item selection
      deleteSelection(item: any) {
            let index: number = this.playlist.indexOf(item);
            if (index !== -1) {
                  this.playlist.splice(index, 1);
            }
            if (this.playlist.length < 1)
                  this.resetInitialValue()
      }

      // control play/pause of iframe
      playPause(videoSelect: any, type: string): void {
            if (videoSelect.id == this.currentVideo.id) {
                  type === 'play' ? this.isPlay = false : this.isPlay = true;
                  type === 'pause' ? this.YoutubePlayer.pausePlayingVideo() : this.YoutubePlayer.playPausedVideo();
                  if (this.playlist.length > 0) {
                        for (let i = 0; i < this.playlist.length; i++) {
                              if (this.currentVideo.id === this.playlist[i].id) {
                                    type === 'play' ? this.playlist[i].isPlay = false : this.playlist[i].isPlay = true;
                              }

                        }
                  }
                  this.snackBar.open(videoSelect.snippet.title, type, {
                        duration: 1000,
                  });
            } else {
                  if (this.playlist.length > 0) {
                        this.resetPlayList(videoSelect);
                  }
            }

      }

      resetPlayList(video){
            for (let i = 0; i < this.playlist.length; i++) {
                  if (video.id === this.playlist[i].id) {
                        this.playlist[i].isPlay = false;
                        this.playlist[i].timeDuration = true;
                        this.currentVideo = video;
                        this.timeDuration = '';
                        this.YoutubePlayer.playVideo(video.id, video.snippet.title);
                        this.playerInfo();
                        this.snackBar.open(video.snippet.title, 'Playing', {
                              duration: 1000,
                        });
                  } else {
                        this.playlist[i].isPlay = true;
                        this.playlist[i].timeDuration = false;
                  }
            } 
      }

      previousVideo(): void {
            var videoIndex = this.playlist.indexOf(this.currentVideo)
            if(videoIndex == 0)
                  this.previousDisable = true;
            if(videoIndex > this.playlist.length)
                  this.nextDisable = false;  
            if (videoIndex > 0) {
                  this.resetPlayList(this.playlist[videoIndex-1]);
            }
           
      }

      nextVideo(): void {
            var videoIndex = this.playlist.indexOf(this.currentVideo)
            if (this.playlist.length > 0) {
                  if(videoIndex == this.playlist.length-1)
                        this.nextDisable = true;
                  if(videoIndex > 0)
                        this.previousDisable = false;
                  if(videoIndex <= this.playlist.length-1){
                        this.resetPlayList(this.playlist[videoIndex+1]);
                  }
            }
      }

      volumeSeek(event: any): void {
            this.volume = this.YoutubePlayer.volume;
            // this.playerInfo();
      }

      speakerClick(): void {
            this.isSpeaker = this.YoutubePlayer.speakerClick();
            if (this.isSpeaker)
                  this.volume = this.YoutubePlayer.volume;
            else
                  this.volume = 0;
      }

      // update required information of current play
      playerInfo(): void {
            var self = this;
            this.volume = this.YoutubePlayer.volume;
            this.isSpeaker = this.YoutubePlayer.speakerClick()
            setInterval(function () {
                  var progressBar = self.YoutubePlayer.updateProgressBar()
                  var timeDuration = self.YoutubePlayer.updateTimerDisplay();
                  if (progressBar) {
                        self.progressBar = progressBar;
                        self.timeDuration = timeDuration
                        self.istimeDuration = true;
                  }
            }, 1000);
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
            this.isSpeaker = false;
      }


}

interface ItemsResponse {
      results: string[];
}

interface videoObject {
      contentDetails: string[];
      etag: string;
      id: string;
      kind: string;
      timeDuration: boolean;
      isPlay: boolean;
      snippet: string[];
      statistics: string[];
}


