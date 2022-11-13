import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { Observable } from 'rxjs';
import { PerformanceStatistics } from '../simulation/models/performance-statistics.model';

@Injectable({
  providedIn: 'root'
})
export class ResultsService extends RequestServiceBase {

  constructor (protected http: HttpClient) {
      super(http);
  }

  getResults(typeId: number, runId: number, itemId: number, reachId: number = null, landId: number = null, soilId: number = null, extraId: number = null) {
    let url = `${environment.api.url}/results/${typeId}/runs/${runId}?itemId=${itemId}`;

      if (reachId) {
        url += `&reachId=${reachId}`;
      }
      if (landId) {
        url += `&landId=${landId}`;
      }
      if (soilId) {
        url += `&soilId=${soilId}`;
      }
      if (extraId) {
        url += `&extraId=${extraId}`;
      }

    const request = new HttpRequest('GET', url,  {
        reportProgress: true,
        responseType: 'json'
    });

    return this.http.request(request);
  }

  downloadResults(typeId: number, runId: number, landId: number = null, soilId: number = null) {
    let url = `${environment.api.url}/results/${typeId}/runs/${runId}`;

  //  if (reachId || landId || soilId) {
  //    url += '?';
   //   if (reachId) {
   //     url += `&reachId=${reachId}`;
   //   }
      if (landId) {
        url += `?landId=${landId}`;
      }
      if (soilId) {
        url += `&soilId=${soilId}`;
      }
 //   }

    return this.get<any[]>(url);
  }

  getResultsItems(runId: number, typeId: number = null) {
    let url = `${environment.api.url}/runs/${runId}/results/items`;

    if (typeId) {
      url += `/${typeId}`;
    }

    return this.get<any[]>(url);
  }

  getResultsItemsMeta(runId: number, typeId: number = null) {
    const url = `${environment.api.url}/runs/${runId}/results/items/meta`;
    return this.get<any[]>(url);
  }

  getResultsStartDate(runId: number) {
    const url = `${environment.api.url}/runs/${runId}/results/startdate`;
    return this.get<any[]>(url);
  }

  getResultsMeta(runId: number = null) {
    let url = `${environment.api.url}/runs`;

    if (runId) {
      url += `/${runId}`;
    }

    url += `/results/meta`;

    return this.get<any[]>(url);
  }

  getPerformanceStatistics(runId: number,
                            isFull: boolean = true,
                            resultItemId: number = null,
                            reachId: number = null): Observable<PerformanceStatistics[]> {
    let url = `${environment.api.url}/runs/${runId}/results/statistics`;

    if (resultItemId) {
      url += `?item=${resultItemId}`;

      if (reachId) {
        url += `&reach=${reachId}`;
      }
    }

    if (isFull) {
      url += resultItemId ? '&' : '?';
      url += 'full=true';
    }

    return this.get<PerformanceStatistics[]>(url);
  }

  getSoilsBelow(runId: number, soilId: number) {
    const url = `${environment.api.url}/results/runs/${runId}/soilsbelow?soilId=${soilId}`;
    return this.get<any>(url);
  }

  getIncaData(runId: number, baselineSmd: number) {
    const url = `${environment.api.url}/runs/${runId}/results/inca?baselineSmd=${baselineSmd}`;
    return this.get<any[]>(url);
  }

  deleteResultsSet(id: number): Observable<any[]> {
    const url = `${environment.api.url}/runs/${id}/results`;
    return this.delete(url);
  }

  getLayout(id: number = null): Observable<any[]> {
    let url = `${environment.api.url}/gui/layouts/results`;

    if (id) {
      url += `/${id}`;
    }

    return this.get<any[]>(url);
  }
}
