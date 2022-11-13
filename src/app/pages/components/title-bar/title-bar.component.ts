import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'slu-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

  @Input() showSubHeading = true;
  @Output() showSidenav = new EventEmitter<boolean>();

  faBars = faBars;
  faUser = faUser;

  isSidenavVisible = true;

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  onMenuClick(e) {
    this.isSidenavVisible = !this.isSidenavVisible;
    this.showSidenav.emit(this.isSidenavVisible);
  }

  onLogoutClick(e) {
    this.auth.logout();
  }
}
