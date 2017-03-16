import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../../reducers';
import * as videos from '../../actions/videos';
import * as player from '../../actions/player';
import * as playlistMenu from '../../actions/playlist';

import { YoutubeService} from '../../services';

import { DiscogsRelease, YoutubeVideo, Playlist, PlaylistAdd } from '../../models';

@Component({
  selector: 'app-release-detail',
  templateUrl: './release-detail.component.html'
})
export class ReleaseDetailComponent implements OnDestroy {
  @Input()
  release: DiscogsRelease;

  @Input()
  releaseVideos: YoutubeVideo[];

  @Input()
  playlists: Playlist[];

  @Input()
  videosLoading: boolean;

  @Input()
  videosLoaded: boolean;

  @Input()
  activeVideoId: string;

  releaseImagesVisible = false;

  get activeTabIndex() { return this.videosLoaded && !this.releaseVideos.length ? 0 : 1; }

  constructor(private store: Store<fromRoot.State>, private youtube: YoutubeService) { }

  onSelectedVideo(video: YoutubeVideo) {
    this.store.dispatch(new videos.SelectedAction({video, release: this.release, playlistIds: []}));
  }

  onQueuedVideo(playlistAdd: PlaylistAdd) {
    const videos = [{video: playlistAdd.videos[0], release: this.release, playlistIds: []}];
    this.store.dispatch(new playlistMenu.AddVideosAction({videos, id: playlistAdd.id}));
  }

  onPlaylistAdd(playlist: Playlist) {
    this.store.dispatch(new playlistMenu.AddAction(playlist));
  }

  toggleImages() {
    this.releaseImagesVisible = !this.releaseImagesVisible;
  }

  ngOnDestroy() {
    this.store.dispatch(new videos.ClearAction());
  }
}
