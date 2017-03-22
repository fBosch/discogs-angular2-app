import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import * as videos from '../../actions/videos';
import * as player from '../../actions/player';

import { DiscogsRelease, YoutubeVideo, PlayerTime, StartTime, SelectedVideo } from '../../models';

@Component({
  selector: 'app-selected-video',
  templateUrl: './selected-video.component.html'
})
export class SelectedVideoComponent {
  @Input()
  playerCurrent: YoutubeVideo;

  @Input()
  playlist: SelectedVideo[];

  @Input()
  playerRelease: DiscogsRelease;

  @Input()
  playerTime: {formatted: string, seconds: number};

  @Input()
  playerVolume: number;

  @Input()
  playing: boolean;

  @Input()
  nextPrevVideos: {next: SelectedVideo, prev: SelectedVideo};

  @Output()
  onTogglePlayerVisibility = new EventEmitter<boolean>();

  playerFrameVisible = false;

  onVideoSkipped(video: SelectedVideo) {
    if (video) {
      this.store.dispatch(new videos.SelectedAction(video));
    }
  }

  onPlaylistSelected(selected: SelectedVideo) {
    this.store.dispatch(new videos.SelectedAction(selected));
  }

  onVideoSeek(time: StartTime) {
    this.store.dispatch(new player.SeekAction(time));
  }

  onVideoTogglePlay(playing: boolean) {
    this.store.dispatch(new player.TogglePlayAction(playing));
  }

  onVolumeSet(volume: number) {
    this.store.dispatch(new player.VolumeInputAction(volume));
  }

  togglePlayerFrame() {
    this.playerFrameVisible = !this.playerFrameVisible;
    this.onTogglePlayerVisibility.emit(this.playerFrameVisible);
  }

  constructor(private store: Store<fromRoot.State>) { }
}
