import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { Observable } from 'rxjs';
import { SnapshotCount } from './dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends RequestServiceBase {

    constructor (protected http: HttpClient) {
        super(http);
    }

    getCounts(): Observable<SnapshotCount[]> {
        const url = `${environment.api.url}/counts`;
        return this.get<SnapshotCount[]>(url);
    }
}
