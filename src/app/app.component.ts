import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { PersistenceService } from './services/persistence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthService, private persistenceService: PersistenceService) {
    if (!this.auth.isLoggingIn && this.persistenceService.lastUrl) {
      this.auth.isLoggingIn = true;
      this.auth.trySilentLogin();
    }
  }

  ngOnInit() {
  }
}
