// Modified from:
// https://blog.angularindepth.com/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4
import { Injectable } from '@angular/core';
import { RequestServiceBase } from '../pages/shared/base-classes/RequestServiceBase';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoggingService extends RequestServiceBase {

  constructor (protected http: HttpClient) {
    super(http);
  }

  logError(message: string, stack: string): boolean {
    let success = true;

    this.postError(message, stack)
        .subscribe(
          res => success = true,
          err => success = false
        );

    return success;
  }

  postError(message: string, stack: string): Observable<any> {
    const url = `${environment.api.baseUrl}/users/auth/errors`;
    return this.post<any>(url, {message, stack});
  }
}
