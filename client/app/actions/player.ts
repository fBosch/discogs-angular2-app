import { Action } from '@ngrx/store';
import { YoutubeVideo, DiscogsRelease } from '../models';
import { type } from '../util';

export const ActionTypes = {
  INIT:         type('[Player] Init'),
  INIT_SUCCESS: type('[Player] Init Success'),
  INIT_FAIL:    type('[Player] Init Fail'),
  PLAY:         type('[Player] Play'),
  PLAYING:      type('[Player] Playing'),
  LOAD_VIDEOS:  type('[Player] Load Videos'),
  STOP:         type('[Player] Stop'),
  RESUME:       type('[Player] Resume'),
  SEEK:         type('[Player] Seek'),
  SET_VOL:      type('[Player] Set Volume'),
  INPUT_VOL:    type('[Player] Input Volume'),
  SET_TIME:     type('[Player] Set Time'),
  GET_TIME:     type('[Player] Get Time')
};

/**
 * Load User Actions
 */
export class InitAction implements Action {
  type = ActionTypes.INIT;

  constructor(public payload: YoutubeVideo[]) { }
}

export class InitSuccessAction implements Action {
  type = ActionTypes.INIT_SUCCESS;

  constructor(public payload: string) { }
}

export class InitFailAction implements Action {
  type = ActionTypes.INIT_FAIL;

  constructor(public payload: any) { }
}

export class PlayAction implements Action {
  type = ActionTypes.PLAY;

  constructor(public payload: { video: YoutubeVideo, release: DiscogsRelease }) { }
}

export class PlayingAction implements Action {
  type = ActionTypes.PLAYING;

  constructor(public payload: YoutubeVideo) { }
}

export class LoadVideosAction implements Action {
  type = ActionTypes.LOAD_VIDEOS;

  constructor(public payload: {videos: YoutubeVideo[], release: DiscogsRelease}) { }
}

export class StopAction implements Action {
  type = ActionTypes.STOP;

  constructor(public payload: any = null) { }
}

export class ResumeAction implements Action {
  type = ActionTypes.RESUME;

  constructor(public payload = null) { }
}

export class SeekAction implements Action {
  type = ActionTypes.SEEK;

  constructor(public payload: {video: YoutubeVideo, time: number}) { }
}

export class VolumeInputAction implements Action {
  type = ActionTypes.INPUT_VOL;

  constructor(public payload: number) { }
}

export class VolumeSetAction implements Action {
  type = ActionTypes.SET_VOL;

  constructor(public payload: number) { }
}

export class GetTimeAction implements Action {
  type = ActionTypes.GET_TIME;

  constructor(public payload: {formatted: string, seconds: number}) { }
}

export class SetTimeAction implements Action {
  type = ActionTypes.SET_TIME;

  constructor(public payload: {video: YoutubeVideo, time: number}) { }
}

export type Actions
  = InitAction
  | InitSuccessAction
  | InitFailAction
  | PlayAction
  | LoadVideosAction
  | StopAction
  | ResumeAction
  | SeekAction
  | SetTimeAction
  | GetTimeAction;
