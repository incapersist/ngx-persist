import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'slu-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  showPhotoModal = false;
  photoSrc = '';
  caption = '';

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onImageClick(e, photoSrc: string) {
    e.stopPropagation();

    this.caption = e.target.alt;
    this.showPhotoModal = true;
    this.photoSrc = photoSrc;

    return false;
  }
}
