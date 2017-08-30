import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

let _window: any = window;

@Injectable()
export class YoutubePlayerService {
	public yt_player;
	public YT;
	public done;
	private currentVideoId: string;
	private promise: Promise<boolean>;

	@Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);

	constructor() {
		var that = this;
		document.getElementById('yt-player-script').onload = function(){
			that.createPlayer();
			// that.YT = _window.YT;
	   }
	}

	createPlayer(){
			let interval = setInterval(() => {
				if ((typeof _window.YT !== 'undefined') && _window.YT && _window.YT.Player) {
					this.yt_player = new _window.YT.Player('yt-player', {
						width: '405',
						height: '295',
						playerVars: {
							color: 'white',
							iv_load_policy: '3',
							rel: '0'
						},
						events: {
							onStateChange: (ev) => {
								this.onPlayerStateChange(ev);
							}
						}
					});
					clearInterval(interval);
				}else {
                   console.log("Player ia not Ready...");
				}
			});
	}


	onPlayerStateChange(event: any) {
		console.log("onPlayerStateChange",event);
		// const state = event.data;
		// switch (state) {
		// 	case 0:
		// 		this.videoChangeEvent.emit(true);
		// 		this.playPauseEvent.emit('pause');
		// 		break;
		// 	case 1:
		// 		this.playPauseEvent.emit('play');
		// 		break;
		// 	case 2:
		// 		this.playPauseEvent.emit('pause');
		// 		break;
		// }
         
	}

	playVideo(videoId: string, videoText?: string): void {
		if (!this.yt_player) {
			console.log("videoId Couldn't Find");
			// 	this.notificationService.showNotification('Player not ready.');
			return;
		}
		console.log('videoId',videoId);
		this.yt_player.loadVideoById(videoId);
		this.currentVideoId = videoId;
		this.currentVideoText.emit(videoText);
	}

	pausePlayingVideo(): void {
		this.yt_player.pauseVideo();
		this.yt_player.setVolume(0);
	}

	playPausedVideo(): void {
		this.yt_player.playVideo();
	}

	getCurrentVideo(): string {
		console.log('this.currentVideoId',this.currentVideoId);
		return this.currentVideoId;
	}

	// resizePlayer(width: number, height: number) {
	// 	this.yt_player.setSize(width, height);
	// }
}