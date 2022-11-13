import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { Observable } from 'rxjs';
import { InputData } from '../shared/models/input-data.model';

@Injectable({
  providedIn: 'root'
})
export class ExportDataService extends RequestServiceBase {

    constructor (protected http: HttpClient) {
        super(http);
    }

    getInputData(id: number = null): Observable<InputData[]> {
        let url = `${environment.api.url}/inputs`;

        if (id) {
            url += `/${id}`;
        }

        return this.get<InputData[]>(url);
    }
}
