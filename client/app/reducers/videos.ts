import * as videos from '../actions/videos';
import { YoutubeVideo } from '../models';
export interface State {
  loaded: boolean;
  loading: boolean;
  failed: string;
  videos: YoutubeVideo[];
  selected: YoutubeVideo;
};

const initialState: State = {
  loaded: false,
  loading: false,
  failed: null,
  videos: [],
  selected: null
};

export function reducer(state = initialState, action: videos.Actions): State {
  switch (action.type) {
    case videos.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true
      });
    }

    case videos.ActionTypes.LOAD_COMPLETE: {
      const youtubeResponse = action.payload;
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        videos: youtubeResponse.items,
      });
    }

    case videos.ActionTypes.LOAD_FAIL: {
      return Object.assign({}, state, {
        loading: false,
        failed: action.payload
      });
    }

    case videos.ActionTypes.SELECTED: {
      return Object.assign({}, state, {
        selected: action.payload.video
      });
    }

    case videos.ActionTypes.CLEAR: {
      return Object.assign({}, state, {
        videos: [],
        loading: false,
        loaded: false
      });
    }

    default: {
      return state;
    }
  }
}

export const getLoaded = (state: State) => state.loaded;

export const getLoading = (state: State) => state.loading;

export const getLoadingFailed = (state: State) => state.failed;

export const getVideoEntities = (state: State) => state.videos;

export const getSelectedVideo = (state: State) => state.selected;
