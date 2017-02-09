import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocalStorageService } from 'angular-2-local-storage';

import { DiscogsService } from './discogs.service';
import { YoutubeResponse, Video } from '../models';

import * as moment from 'moment';

const YT_REGEXES = [
  /https?:\/\/(?:www\.)?youtube\.com\/.*?v=(.*)$/,
  /https?:\/\/youtu\.be\/(.*)/
];

export function formatDuration(span: any) {
  const spanSeconds = span.seconds();
  const seconds = spanSeconds < 10 ? `0${spanSeconds}` : spanSeconds;
  return `${span.minutes()}:${seconds}`;
}

@Injectable()
export class YoutubeService {
  private _videoSelectedSource = new Subject<any>();
  private _videoListSource = new Subject<any>();
  private _videoActivatedSource = new Subject<any>();
  private _loadVideosSource = new Subject<Video[]>();

  videoSelected$ = this._videoSelectedSource.asObservable();
  videoActivated$ = this._videoActivatedSource.asObservable();
  videoList$ = this._videoListSource.asObservable();
  loadVideos$ = this._loadVideosSource.asObservable();

  constructor(private http: Http, private discogs: DiscogsService,
    private localStorage: LocalStorageService) { }

  getListData(ids: string[]): Observable<any> {
    return this.http.post('/api/videos', {ids})
      .map(response => response.json());
  }

  getIdFromUrl(url): string {
    return url.match(YT_REGEXES[0])[1] || url.match(YT_REGEXES[1])[1];
  }

  selectVideo(video: any) {
    this.localStorage.set('activeVideo', video);
    this._videoSelectedSource.next(video);
  }

  publishVideos(videos: any) {
    this._videoListSource.next(videos);
  }

  activateVideo(video: any) {
    this.localStorage.set('activeVideo', video);
    this._videoActivatedSource.next(video);
  }

  playAll(release: any, callback: (video: any) => void) {
    if (!release) {
      return;
    }

    this.discogs.getRelease(release.id)
      .mergeMap(response => {
        const videoList = response.json().videos;
        const urls = videoList
          ? videoList.map(v => this.getIdFromUrl(v.uri)) : [];
        return this.getListData(urls);
      })
      .subscribe(response => {
        const videos = response.json().items;
        this.publishVideos({releaseInfo: release, items: videos});

        const video = videos[0];

        if (video) {
          video.discogsId = release.id;
          video.discogsTitle = release.title || release.basic_information.title;

          this.selectVideo(video);
          this.activateVideo(video);
        }

        callback(video);
      });
  }

  loadVideos(videos: Video[]) {
    this._loadVideosSource.next(videos);
  }
}
