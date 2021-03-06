import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { LocalStorageService } from 'angular-2-local-storage';

import * as models from '../models';

@Injectable()
export class DiscogsService {

  constructor(private http: Http, private localStorage: LocalStorageService) { }

  updateWantlistIds(response: any) {
    this.localStorage.set('wantlist_ids', response.ids);
    this.localStorage.set('wantlist_lastUpdated', response.lastUpdated);
  }

  getWantlistIds(count: number, lastAdded: Date): Observable<any> {
    const lastUpdated = this.localStorage.get('wantlist_lastUpdated') as Date;
    const ids = this.localStorage.get('wantlist_ids') as number[];
    if (lastUpdated && lastUpdated >= lastAdded) {
      return of({ids, lastUpdated});
    }
    return this.http.get(`/api/wantlistids?want_count=${count}`)
      .map(response => response.json());
  }

  searchReleases(term: string, page = 1): Observable<models.DiscogsSearch> {
    return this.http.get(`/api/search/releases/${term}/${page}`)
      .map(response => response.json());
  }

  getUser(): Observable<models.DiscogsUser> {
    return this.http.get(`/api/user`)
      .map(response => response.json());
  }

  getListByType(type: string, page = 1):
    Observable<models.DiscogsCollection | models.DiscogsWants | models.DiscogsSales> {
      return this.http.get(`/api/${type}/${page}`)
        .map(response => response.json());
    }

  getRelease(id: string):  Observable<models.DiscogsRelease> {
    return this.http.get(`/api/releases/${id}`)
      .map(response => response.json());
  }

  getArtist(id: number): Observable<any> {
    return this.http.get(`/api/artists/${id}`)
      .map(response => response.json());
  }

  getLabel(id: number): Observable<any> {
    return this.http.get(`/api/labels/${id}`)
      .map(response => response.json());
  }

  getListing(id: number): Observable<models.DiscogsListing> {
    return this.http.get(`/api/listing/${id}`)
      .map(response => response.json());
  }

  getNextRelease(releases: models.DiscogsRelease[], currentId: number) {
    const currentIndex = releases
      .map(r => r.id).indexOf(currentId);

    return releases.length && currentIndex > -1
        ? releases[currentIndex + 1]
        : null;
  }

  putWantlist(id: number): Observable<any> {
    return this.http.put(`api/wantlist/${id}`, {})
      .map(response => response.json());
  }

  deleteWantlist(id: number): Observable<any> {
    return this.http.delete(`api/wantlist/${id}`);
  }
}
