export class VideoModel {

    constructor(
        public contentDetails: string[],
        public etag: string,
        public id: string,
        public kind: string,
        public timeDuration: boolean,
        public isPlay: boolean,
        public snippet: string[],
        public statistics: string[],
    ) { }  
}