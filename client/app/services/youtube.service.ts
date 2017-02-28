import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Store } from '@ngrx/store';

import { Observable, Subject } from 'rxjs';

import { LocalStorageService } from 'angular-2-local-storage';

import * as YouTubePlayer from 'youtube-player';

import * as fromRoot from '../reducers';
import * as player from '../actions/player';

import { DiscogsService } from './discogs.service';
import { YoutubeResponse, YoutubeVideo, Video, PlayerTime } from '../models';

import * as moment from 'moment';

export const YT_REGEXES = [
  /https?:\/\/(?:www\.)?youtube\.com\/.*?v=(.*)$/,
  /https?:\/\/youtu\.be\/(.*)/
];

export enum YTPLAYER_STATE {
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}

export function formatDuration(span: any) {
  const spanSeconds = span.seconds();
  const seconds = spanSeconds < 10 ? `0${spanSeconds}` : spanSeconds;
  return `${span.minutes()}:${seconds}`;
}

@Injectable()
export class YoutubeService {
  private _playbackEndedSubject = new Subject<any>();
  playbackEnded$ = this._playbackEndedSubject.asObservable();

  player = YouTubePlayer('youtube-player');

  getListData(ids: string[]): Observable<YoutubeResponse> {
    return this.http.post('/api/videos', {ids})
      .map(response => response.json());
  }

  getIdFromUrl(url): string {
    return url.match(YT_REGEXES[0])[1] || url.match(YT_REGEXES[1])[1];
  }

  setActiveVideo(video: any) {
    this.localStorage.set('activeVideo', video);
  }

  initPlayer(volume: number) {
    this.player.on('ready', event => {
      event.target.setVolume(volume);
    });

    this.player.on('stateChange', event => {
      switch (event.data) {
        case YTPLAYER_STATE.ENDED:
          this._playbackEndedSubject.next();
          break;
        case YTPLAYER_STATE.PLAYING:
          break;
        case YTPLAYER_STATE.BUFFERING:
          break;
      }
    });
  }

  playerTime(duration: string, startTime = 0): Observable<PlayerTime> {
    const ms = startTime * 1000;

    if (!duration) {
      const span = moment.duration(startTime, 'seconds');
      return Observable.of({
        formatted: formatDuration(span),
        seconds: span.asSeconds()
      });
    }

    const trackDuration = moment
      .duration(duration)
      .asMilliseconds() + 1000;

    return Observable
      .timer(0, 1000)
      .takeUntil(Observable.timer((trackDuration) - ms))
      .map(t => {
        const span = moment.duration(startTime + t, 'seconds');
        return {
          formatted: formatDuration(span),
          seconds: span.asSeconds()
        };
      });
  }

  constructor(private http: Http, private discogs: DiscogsService,
    private localStorage: LocalStorageService, private store: Store<fromRoot.State>) { }
}
