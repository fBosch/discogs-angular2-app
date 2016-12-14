import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DiscogsService {
  private get headers(): Headers { return new Headers({ 'Accept': 'application/vnd.discogs.v2.html+json' }); }
  private get getOptions(): RequestOptions { return new RequestOptions({ headers: this.headers }); }

  private readonly apiBase = 'https://api.discogs.com';
  private readonly token = 'dkNuuUEtAEjdSyZiTLTplyGLIbYFujOZJgvMrYLH';

  constructor(private http: Http) { }

  getWantlist(): Observable<any> {
    return this.http.get('/api/wantlist');
  }

  getRelease(id: number): Observable<any> {
    return this.http.get(`/api/releases/${id}`);
  }

  getArtist(id: number): Observable<any> {
    return this.http.get(`/api/artists/${id}`);
  }

  getLabel(id: number): Observable<any> {
    return this.http.get(`/api/labels/${id}`);
  }

  getCollection(folderId = 0): Observable<any> {
    return this.http.get('/api/collection');
  }

  getInventory(): Observable<any> {
    return this.http.get('/api/inventory');
  }

  getListing(id: number): Observable<any> {
    return this.http.get(`/api/listing/${id}`);
  }
}