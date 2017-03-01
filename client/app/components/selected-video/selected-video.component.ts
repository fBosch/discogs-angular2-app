import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import * as videos from '../../actions/videos';
import * as player from '../../actions/player';

import { DiscogsRelease, YoutubeVideo, PlayerTime, StartTime } from '../../models';

@Component({
  selector: 'app-selected-video',
  templateUrl: './selected-video.component.html',
  styleUrls: ['./selected-video.component.css']
})
export class SelectedVideoComponent {
  @Input()
  selectedVideo: YoutubeVideo;

  @Input()
  playlist: YoutubeVideo[];

  @Input()
  playerRelease: DiscogsRelease;

  @Input()
  playerTime: {formatted: string, seconds: number};

  @Input()
  playerVolume: number;

  @Input()
  playing: boolean;

  @Input()
  nextPrevVideos: {next: YoutubeVideo, prev: YoutubeVideo};

  onVideoSkipped(video: YoutubeVideo) {
    if (video) {
      this.store.dispatch(new videos.SelectedAction({video, release: this.playerRelease}));
    }
  }

  onVideoSeek(time: StartTime) {
    this.store.dispatch(new player.SeekAction(time));
  }

  onVideoTogglePlay(time: number) {
    this.store.dispatch(new player.TogglePlayAction(time));
  }

  togglePlayerFrame() {
    return false;
  }

  constructor(private store: Store<fromRoot.State>) { }
}
