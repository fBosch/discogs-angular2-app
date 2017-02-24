import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { LocalStorageService } from 'angular-2-local-storage';

import * as moment from 'moment';

import * as player from '../actions/player';
import * as videos from '../actions/videos';

import * as fromPlayer from '../reducers';

import { YoutubeService, formatDuration } from '../services/youtube.service';
import { YoutubeVideo } from '../models';

@Injectable()
export class PlayerEffects {
  playerTime$: Observable<{formatted: string, seconds: number}>;

  @Effect()
  initPlayer$: Observable<Action> = this.actions$
    .ofType(player.ActionTypes.INIT)
    .map(action => {
      this.youtube.initPlayer(action.payload);
      return new player.InitSuccessAction(action.payload);
    });

  @Effect()
  playVideo$: Observable<Action> = this.actions$
    .ofType(player.ActionTypes.PLAY)
    .map(action => {
      this.youtube.player.loadVideoById(action.payload.video && action.payload.video.id);
      return new player.PlayingAction(action.payload.video);
    });

  @Effect()
  playNext$: Observable<Action> = this.actions$
    .ofType(player.ActionTypes.PLAY_NEXT)
    .withLatestFrom(this.store, (action, state) => state.player)
    .map(state =>
      new videos.SelectedAction({video: state.next, release: state.release})
    );

  @Effect()
  seekTo$: Observable<Action> = this.actions$
    .ofType(player.ActionTypes.SEEK)
    .map(action => {
      this.youtube.player.seekTo(action.payload.time);
      return new player.SetTimeAction(action.payload);
    });

  @Effect()
  setTime$: Observable<Action> = this.actions$
    .ofType(player.ActionTypes.SET_TIME)
    .switchMap(action => {
      this.playerTime$ = this.youtube.playerTime(action.payload.video, action.payload.time);
      return this.playerTime$
        .map(time => new player.GetTimeAction(time));
    });

  @Effect()
  stopVideo$ = this.actions$
    .ofType(player.ActionTypes.STOP)
    .withLatestFrom(this.store, (action, state) => state.player)
    .map(state => {
      this.youtube.player.pauseVideo();
      this.playerTime$ = null;
      return time => new player.GetTimeAction({
        formatted: state.timeFormatted,
        seconds: state.timeSeconds
      });
    });

  @Effect()
  resumeVideo$ = this.actions$
    .ofType(player.ActionTypes.RESUME)
    .map(action => {
      this.youtube.player.playVideo();
      return of({});
    });

  @Effect()
  inputVolume$ = this.actions$
    .ofType(player.ActionTypes.INPUT_VOL)
    .map(action => {
      this.youtube.player.setVolume(action.payload);
      return of({});
    });

  @Effect()
  setVolume$ = this.actions$
    .ofType(player.ActionTypes.SET_VOL)
    .map(action => {
      this.localStorage.set('playerVolume', action.payload);
      return of({});
    });

  constructor(private actions$: Actions, private store: Store<fromPlayer.State>,
    private youtube: YoutubeService, private localStorage: LocalStorageService) { }
}
