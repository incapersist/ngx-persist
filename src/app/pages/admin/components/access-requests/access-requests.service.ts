import { Injectable } from '@angular/core';
import { RequestServiceBase } from 'src/app/pages/shared/base-classes/RequestServiceBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccessRequestsService extends RequestServiceBase {

  constructor (protected http: HttpClient) {
    super(http);
  }

  getPending(): Observable<string> {
    const url = `${environment.api.baseUrl}/users/auth/signup/pending`;
    return this.get<string>(url);
  }

  postApproval(userId: number, email: string, name: string): Observable<any> {
    const url = `${environment.api.baseUrl}/users/auth/signup/approval`;
    const body = { 'userId': userId, 'email': email, 'name': name };
    return this.post<number>(url, body);
  }

  postDenial(userId: number, email: string, name: string): Observable<any> {
    const url = `${environment.api.baseUrl}/users/auth/signup/denial`;
    const body = { 'userId': userId, 'email': email, 'name': name };
    return this.post<number>(url, body);
  }
}
