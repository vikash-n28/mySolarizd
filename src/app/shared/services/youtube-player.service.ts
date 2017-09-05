import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

let _window: any = window;
let time_update_interval: any;
let interval: any;

@Injectable()
export class YoutubePlayerService {
	public yt_player;
	public YT;
	public done;
	public ytCurrentTime;
	public ytProgressBar;
	public ytDuration;
	public volume;
	private currentVideoId: string;
	private promise: Promise<boolean>;

	@Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);
	

	constructor() {
		var self = this;
		document.getElementById('yt-player-script').onload = function () {
			self.createPlayer();
			// that.YT = _window.YT;
		}
	}

	createPlayer() {
		interval = setInterval(() => {
			if ((typeof _window.YT !== 'undefined') && _window.YT && _window.YT.Player) {
				this.yt_player = new _window.YT.Player('yt-player', {
					width: '388',
					height: '299',
					playerVars: {
						color: 'white',
						iv_load_policy: '3',
						rel: '0'
					},
					events: {
						onStateChange: (ev) => {
							this.initialize();
							this.onPlayerStateChange(ev);

						}
					}
				});
				clearInterval(interval);
			} else {
				console.log("Player ia not Ready...");
			}
		});
	}

	initialize() {
		var self = this;
		if (this.currentVideoId) {
			this.updateTimerDisplay();
			this.updateProgressBar();
			this.volume = Math.round(this.yt_player.getVolume());

			clearInterval(time_update_interval);
			// Start interval to update elapsed time display and
			// the elapsed part of the progress bar every second.
			time_update_interval = setInterval(function () {
				self.updateTimerDisplay();
				self.updateProgressBar();
			}, 1000);
		}

	}


	onPlayerStateChange(event: any) {
		const state = event.data;
		switch (state) {
			case 0:
				this.videoChangeEvent.emit(true);
				this.playPauseEvent.emit('pause');
				break;
			case 1:
				this.playPauseEvent.emit('play');
				break;
			case 2:
				this.playPauseEvent.emit('pause');
				break;
		}
		// console.log('state',this.playPauseEvent);
	}

	playVideo(videoId: string, videoText?: string): void {
		if (!this.yt_player) {
			console.log("videoId Couldn't Find");
			// 	this.notificationService.showNotification('Player not ready.');
			return;
		}
		this.yt_player.loadVideoById(videoId);
		this.currentVideoId = videoId;
		this.currentVideoText.emit(videoText);
	}

	volumeSeek(event: any): void {
		if (!this.yt_player)
			return;
		this.yt_player.setVolume(event.volume);	
	}

	pausePlayingVideo(): void {
		this.yt_player.pauseVideo();
		this.yt_player.setVolume(0);
	}

	playPausedVideo(): void {
		this.yt_player.playVideo();
	}

	getCurrentVideo(): string {
		return this.currentVideoId;
	}

	// resizePlayer(width: number, height: number) {
	// 	this.yt_player.setSize(width, height);
	// }

    speakerClick(){
		if(this.yt_player){
			if(this.yt_player.isMuted()){
				this.yt_player.unMute();
				return true
			}else{
				this.yt_player.mute()
				return false
			}
		}
	}

	stopCurrentVideo(): void {
		if(this.yt_player)
		this.yt_player.stopVideo();
		clearInterval(interval);
	}

	updateTimerDisplay() {
		this.ytCurrentTime = this.formatTime(this.yt_player.getCurrentTime());
		this.ytDuration = this.formatTime(this.yt_player.getDuration());
		return {ytCurrentTime:this.ytCurrentTime,ytDuration:this.ytDuration}
	};

	updateProgressBar() {
	 return this.ytProgressBar = ((this.yt_player.getCurrentTime() / this.yt_player.getDuration()) * 100);
	}

	// Helper Functions
	formatTime(time: any) {
		time = Math.round(time);
		var second;
		var minutes = Math.floor(time / 60),
			seconds = time - minutes * 60;
		second = seconds < 10 ? '0' + seconds : seconds;
		return minutes + ":" + second;
	}

}
