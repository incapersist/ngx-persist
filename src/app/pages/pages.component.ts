import { Component, OnInit, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'slu-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, OnDestroy {

  opened = true;
  isMobile = true;
  activeLinkIndex = 1;
  private _mediaSubscription: Subscription;

  links = [
    { title: 'Dashboard', icon: 'tachometer-alt', url: 'dashboard' },
    { title: 'Upload data', icon: 'cloud-upload-alt', url: 'import' },
    { title: 'Edit parameters', icon: 'square-root-alt', url: 'parameters' },
    { title: 'Run model', icon: 'calculator', url: 'model-run' },
    { title: 'View results', icon: 'chart-bar', url: 'results' },
    { title: 'Download data', icon: 'cloud-download-alt', url: 'export' },
    { title: 'Admin', icon: 'tools', url: 'admin', roles: ['Administrator'] },
  ];

  constructor(public authService: AuthService, private media: MediaObserver) {}

  ngOnInit() {
    // https://stackoverflow.com/questions/40321032/material2-show-hide-md-sidenav-depending-on-media
    this._mediaSubscription = this.media.media$.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs') || (change.mqAlias === 'sm');
      this.opened = !this.isMobile;
    });
  }

  onLinkClick(index: number) {
    this.activeLinkIndex = index;

    if (this.isMobile) {
      this.opened = false;
    }
  }

  ngOnDestroy() {
    this._mediaSubscription.unsubscribe();
  }
}
