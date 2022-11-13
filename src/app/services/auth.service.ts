// src/app/auth/auth.service.ts

import { Injectable, Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PersistenceService } from './persistence.service';

@Component({
  selector: 'slu-dialog-login-denied',
  templateUrl: 'dialog-login-denied.html',
})
export class DialogLoginDeniedComponent {
  constructor(public dialogRef: MatDialogRef<DialogLoginDeniedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Injectable()
export class AuthService {

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;
  private _roles: string[];
  private _isLoggingIn = false;

  a0 = new auth0.WebAuth({
    clientID: environment.auth0.clientID,
    domain: environment.auth0.domain,
    redirectUri: environment.auth0.redirectUri,
    responseType: 'token id_token',
    scope: 'openid profile',
  });

  constructor(public router: Router,
              private http: HttpClient,
              private persistenceService: PersistenceService,
              public dialog: MatDialog) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;

    this._isLoggingIn = (localStorage.getItem('isLoggingIn') === 'true');
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  set isLoggingIn(isLi: boolean) {
    localStorage.setItem('isLoggingIn', isLi ? 'true' : 'false');
    this._isLoggingIn = isLi;
  }

  get isLoggingIn(): boolean {
    return this._isLoggingIn;
  }

  public login(): void {
    this.a0.authorize();
  }

  public trySilentLogin() {
    this.a0.authorize({prompt: 'none'});
 }

  public handleAuthentication(): void {
    this.a0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        const userid = authResult.idTokenPayload.sub.substring(authResult.idTokenPayload.sub.indexOf('|') + 1);
        this.getUserStatus(userid)
            .subscribe(res => {
              switch (res) {
                case 'PENDING': this.openDialog(1); break;
                case 'DENIED': this.openDialog(2); break;
                case 'NO_EMAIL_VERIFICATION': this.openDialog(3); break;
                case 'APPROVED': this.finishLogin(userid, authResult);
              }
            });
      } else if (err) {
        if (err.errorDescription === 'user is blocked') {
          this.openDialog(1);
        } else {
          this.openDialog(4);
        }
      }
    });
  }

  public hasRole(roles: string[]): boolean {
    if (!this._roles) { return false; }
    return (this._roles.filter(x => roles.some(y => x.indexOf(y) > -1)).length > 0);
  }

  openDialog(statusCode: number): void {
    const dialogRef = this.dialog.open(DialogLoginDeniedComponent, {
      width: '350px',
      data: { statusCode: statusCode },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.logout();
    });
  }

  private finishLogin(userid, authResult) {
    this.localLogin(authResult);
    this.getUserRoles(userid)
        .subscribe(role => {
          this.setRole(role);
          if (this.persistenceService.lastUrl) {
            this.router.navigateByUrl(this.persistenceService.lastUrl);
          } else {
            this.router.navigate(['/pages/dashboard']);
          }
        });
  }

  private getUserStatus(userId: string): Observable<any> {
    const url = `${environment.api.baseUrl}/signup/status?id=${userId}`;
    return this.http.get<any>(url);
  }

  private getUserRoles(id: any): Observable<string> {
    let url = `${environment.api.baseUrl}/users`;

    if (id) {
        url += `/${id}`;
    }

    url += '/auth/roles';

    return this.http.get<string>(url);
  }

  private setRole(role: string = null) {
    if (role) {
      this._roles = [role];
    }

    if (!this._roles || !this._roles[0] || this._roles.length === 0) {
      this._roles = ['User'];
    }
  }

  private localLogin(authResult, roles: string[] = null): void {
    // Set the time that the Access Token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;

    this.isLoggingIn = false;
  }

  public renewTokens(): void {
    console.log('renew tokens');
    this.a0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;
    this._roles = [];

    this.a0.logout({
      returnTo: window.location.origin
    });

    this.persistenceService.clear();
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }
}
