import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

let _window: any = window;

@Injectable()
export class YoutubePlayerService {
	public yt_player;
	private currentVideoId: string;
	private promise: Promise<boolean>;

	@Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
	@Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);

	createPlayer(): Promise<boolean>{
		return new Promise((resolve, reject) => {
			var tag = document.createElement('script');
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			let interval = setInterval(() => {
				if ((typeof _window.YT !== 'undefined') && _window.YT && _window.YT.Player) {
					this.yt_player = new _window.YT.Player('yt-player', {
						width: '410',
						height: '300',
						playerVars: {
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
				}
				
			});
			console.log("service calling...");
			if(interval)
			resolve(true);
			else
			reject(false);	
		});


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
	}

	playVideo(videoId: string, videoText?: string): void {
		if (!this.yt_player) {
			console.log("player is not ready...");
			// 	this.notificationService.showNotification('Player not ready.');
			return;
		}
		this.yt_player.loadVideoById(videoId);
		this.currentVideoId = videoId;
		this.currentVideoText.emit(videoText);
	}

	pausePlayingVideo(): void {
		this.yt_player.pauseVideo();
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
}