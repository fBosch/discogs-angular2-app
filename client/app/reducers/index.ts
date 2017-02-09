import { createSelector } from 'reselect';
import { ActionReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';
import { environment } from '../../environments/environment';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import * as fromRelease from './release';
import * as fromVideos from './videos';
import * as fromCollection from './collection';
import * as fromWantlist from './wantlist';
import * as fromUser from './user';
// import * as fromLayout from './layout';
// import * as fromSearch from './search';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface State {
  release: fromRelease.State;
  videos: fromVideos.State;
  collection: fromCollection.State;
  wantlist: fromWantlist.State;
  user: fromUser.State;
  router: fromRouter.RouterState;
  // layout: fromLayout.State;
  // search: fromSearch.State;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  release: fromRelease.reducer,
  videos: fromVideos.reducer,
  collection: fromCollection.reducer,
  wantlist: fromWantlist.reducer,
  user: fromUser.reducer,
  router: fromRouter.routerReducer
  // search: fromSearch.reducer,
  // layout: fromLayout.reducer
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (!environment.production) {
    return developmentReducer(state, action);
  }

  return productionReducer(state, action);
}


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<State>) {
 * 	  this.booksState$ = state$.select(getBooksState);
 * 	}
 * }
 * ```
 */
// Discogs Release
export const getReleaseState = (state: State) => state.release;

/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them useable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function from the reselect library creates
 * very efficient selectors that are memoized and only recompute when arguments change.
 * The created selectors can also be composed together to select different
 * pieces of state.
 */
export const getSelecteReleaseId = createSelector(getReleaseState, fromRelease.getReleaseId);
export const getSelectedRelease = createSelector(getReleaseState, fromRelease.getReleaseEntity);

export const getVideosState = (state: State) => state.videos;
export const getVideos = createSelector(getVideosState, fromVideos.getVideoEntities);

/**
 * Just like with the books selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
// export const getSearchState = (state: State) => state.search;

// export const getSearchBookIds = createSelector(getSearchState, fromSearch.getIds);
// export const getSearchQuery = createSelector(getSearchState, fromSearch.getQuery);
// export const getSearchLoading = createSelector(getSearchState, fromSearch.getLoading);


/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */
// export const getSearchResults = createSelector(getBookEntities, getSearchBookIds, (books, searchIds) => {
//   return searchIds.map(id => books[id]);
// });

// Discogs Collection
export const getCollectionState = (state: State) => state.collection;

export const getCollectionLoaded = createSelector(getCollectionState, fromCollection.getLoaded);
export const getCollectionLoading = createSelector(getCollectionState, fromCollection.getLoading);
export const getCollection = createSelector(getCollectionState, fromCollection.getReleases);

// Discogs Wantlist
export const getWantlistState = (state: State) => state.wantlist;

export const getWantlistLoaded = createSelector(getWantlistState, fromWantlist.getLoaded);
export const getWantlistLoading = createSelector(getWantlistState, fromWantlist.getLoading);
export const getWantlist = createSelector(getWantlistState, fromWantlist.getReleases);

// Discogs User
export const getUserState = (state: State) => state.user;

export const getUserLoaded = createSelector(getUserState, fromUser.getLoaded);
export const getUserLoading = createSelector(getUserState, fromUser.getLoading);
export const getUser = createSelector(getUserState, fromUser.getUser);

// export const isSelectedReleaseInCollection = createSelector(getCollectionReleaseIds,
//   getSelectedReleaseId, (ids: number[], selected: number) => {
//   return ids.indexOf(selected) > -1;
// });

/**
 * Layout Reducers
 */
// export const getLayoutState = (state: State) => state.layout;

// export const getShowSidenav = createSelector(getLayoutState, fromLayout.getShowSidenav);