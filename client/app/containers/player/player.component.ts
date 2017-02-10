import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';

import { YoutubeVideo, DiscogsRelease } from '../../models';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html'
})
export class PlayerComponent {
  selectedVideo$: Observable<YoutubeVideo>;
  playingRelease$: Observable<DiscogsRelease>;

  constructor(private store: Store<fromRoot.State>) {
    this.selectedVideo$ = store.select(fromRoot.getSelectedVideo);
    this.playingRelease$ = store.select(fromRoot.getSelectedRelease)
    // this.playingRelease$ = store.select(fromRoot.getPlayerRelease);
  }
}
