import { Component, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as videos from '../../actions/videos';
import * as wantlist from '../../actions/wantlist';
import * as playlistMenu from '../../actions/playlist';

import { DiscogsRelease, YoutubeVideo, Playlist, PlaylistAdd, SelectedVideo } from '../../models';

@Component({
  selector: 'app-release-detail',
  templateUrl: './release-detail.component.html'
})
export class ReleaseDetailComponent implements OnDestroy {
  @Input()
  release: DiscogsRelease;

  @Input()
  inWantlist: boolean;

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

  onSelectedVideo(video: YoutubeVideo) {
    const selected = {video, release: this.release};
    const videoList: SelectedVideo[] = this.releaseVideos.map(v => {
      return {
        video: v,
        release: this.release
      };
    });
    this.store.dispatch(new videos.SelectedAction({selected, videos: videoList}));
  }

  onQueuedVideo(playlistAdd: PlaylistAdd) {
    const videos = [{video: playlistAdd.videos[0], release: this.release}];
    this.store.dispatch(new playlistMenu.AddVideosAction({videos, id: playlistAdd.id}));
  }

  onPlaylistAdd(playlist: Playlist) {
    this.store.dispatch(new playlistMenu.AddAction(playlist));
  }

  addToWantlist() {
    this.store.dispatch(new wantlist.AddReleaseAction(this.release));
  }

  removeFromWantlist() {
    this.store.dispatch(new wantlist.RemoveReleaseAction(this.release));
  }

  toggleImages() {
    this.releaseImagesVisible = !this.releaseImagesVisible;
  }

  ngOnDestroy() {
    this.store.dispatch(new videos.ClearAction());
  }

  constructor(private store: Store<fromRoot.State>) { }
}
