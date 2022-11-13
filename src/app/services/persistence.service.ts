import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  _lastUrl: string = null;

  constructor(private router: Router) {
    this._lastUrl = localStorage.getItem('previousUrl');
    // https://stackoverflow.com/questions/41038970/how-to-determine-previous-page-url-in-angular
    this.router.events
                .subscribe((event) => {
                  if (event instanceof NavigationEnd) {
                    if (this.router.url.includes('/pages')) {
                      localStorage.setItem('previousUrl', this.router.url);
                      this._lastUrl = this.router.url;
                    }
                  }
                });
  }

  get lastUrl(): string {
    return this._lastUrl;
  }

  public clear() {
    localStorage.removeItem('previousUrl');
  }
}
