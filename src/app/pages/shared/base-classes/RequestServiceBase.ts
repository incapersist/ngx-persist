// Thin wrapper for HttpClient functions
// App services that make HTTP requests may derive from this class
// Errors are handled by an error interceptor (see app.module.ts)
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class RequestServiceBase {

    constructor (protected http: HttpClient) {}

    get<T>(url: string) {
        return this.http.get<T>(url, {responseType: 'json'})
                        .pipe(take(1));
    }

    post<T>(url: string, body: any) {
 //       const httpOptions = {
 //           headers: new HttpHeaders({
 //               'Content-Type':  'application/json',
  //          })
  //      };

        return this.http.post<T>(url, body)
                        .pipe(take(1));
    }

    put<T>(url: string, body: any) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
            })
        };

        return this.http.put<T>(url, body, httpOptions)
                        .pipe(take(1));
    }

    delete(url: string): Observable<any> {
        return this.http.delete(url)
                        .pipe(take(1));
    }
}
