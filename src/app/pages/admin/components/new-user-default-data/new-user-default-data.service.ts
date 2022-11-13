import { Injectable } from '@angular/core';
import { RequestServiceBase } from 'src/app/pages/shared/base-classes/RequestServiceBase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ModelSetupMeta } from '../../../simulation/models/model-setup.model';

@Injectable({
  providedIn: 'root'
})
export class NewUserDefaultDataService extends RequestServiceBase {

  constructor (protected http: HttpClient) {
    super(http);
  }

  getCurrent(): Observable<ModelSetupMeta[]> {
    const url = `${environment.api.baseUrl}/users/auth/signup/setups`;
    return this.get<ModelSetupMeta[]>(url);
  }

  putDefaultModelSetups(modelSetups: ModelSetupMeta[]): Observable<any> {
    const url = `${environment.api.baseUrl}/users/auth/signup/setups`;
    const body = modelSetups;
    return this.put<number>(url, body);
  }
}
