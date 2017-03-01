import { Component, ChangeDetectionStrategy  } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../reducers';
import { DiscogsCollection } from '../../models';

@Component({
  selector: 'app-collection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './collection.component.html'
})
export class CollectionComponent{
  collection$: Observable<DiscogsCollection>;
  loading$: Observable<boolean>;
  currentPage$: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.collection$ = store.select(fromRoot.getCollection);
    this.currentPage$ = store.select(fromRoot.getCollectionPage);
    this.loading$ = store.select(fromRoot.getCollectionLoading);
  }
}
