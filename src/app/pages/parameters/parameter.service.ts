import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { ParameterSet, IParameter, ParameterSetMeta } from './models/parameter-set';
import { environment } from 'src/environments/environment';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { IndexerName } from '../simulation/models/indexer';
import { StreamNetwork } from '../shared/models/stream-network.model';
import { shareReplay } from 'rxjs/internal/operators/shareReplay';
import { map } from 'rxjs/internal/operators/map';
import { ReachStructure } from '../import-data/structure-upload/models/ReachStructure';

@Injectable({
  providedIn: 'root'
})
export class ParameterService extends RequestServiceBase {

    private newParameterSetMeta = new Subject<ParameterSetMeta>();
    newParameterSetMeta$ = this.newParameterSetMeta.asObservable();
    defaults: IParameter[];

    private $parameterSetMetaCache: Observable<ParameterSetMeta[]>;

    constructor (protected http: HttpClient) {
        super(http);
        this.fetchParameterDefaults();
    }

    emitNewParameterSetMeta(parameterSetMeta: any, autoSelect: boolean = false) {
        this.newParameterSetMeta.next(parameterSetMeta);
    }

    defaultParameter(id: number): IParameter {
        const p = this.defaults.find(x => +x.id === +id);
        return p;
    }

    fetchParameterDefaults() {
        this.getParameterDefaults()
            .subscribe(res => {
                this.defaults = res;
            });
    }

    getParameterSet(id: number = null, useFull: boolean = true): Observable<ParameterSet[]> {
        let url = `${environment.api.url}/parametersets`;

        if (id) {
            url += `/${id}`;
        }

        url += `?full=${useFull ? 1 : 0}`;

        return this.get<ParameterSet[]>(url);
    }

    getParameterSetMeta(id: number = null, force: boolean = false): Observable<ParameterSetMeta[]> {
        if (force || !this.$parameterSetMetaCache) {
            this.$parameterSetMetaCache = this.requestParameterSetMeta(id).pipe(
                shareReplay()
            );
        }

        if (id) {
            return this.$parameterSetMetaCache.pipe(map(x => x.filter(y => +y.id === id)));
        } else {
            return this.$parameterSetMetaCache;
        }
    }

    requestParameterSetMeta(id: number = null): Observable<ParameterSetMeta[]> {
        let url = `${environment.api.url}/parametersets`;

 //       if (id) {
 //           url += `/${id}`;
 //       }

        url += '/meta';

        return this.get<ParameterSetMeta[]>(url);
    }

    getStreamNetworkMeta(id: number = null): Observable<StreamNetwork[]> {
        let url = `${environment.api.url}/networks`;

        if (id) {
            url += `/${id}`;
        }

        url += '/meta';

        return this.get<StreamNetwork[]>(url);
    }

    getStreamNetwork(id: number = null): Observable<string> {
        const url = `${environment.api.url}/networks/${id}`;
        return this.get<string>(url);
    }

    getStreamNetworkJson(parameterSetId: number = null): Observable<string> {
        const url = `${environment.api.url}/parametersets/${parameterSetId}/networks/json`;
        return this.get<string>(url);
    }

    getParameterDefaults(): Observable<IParameter[]> {
        const url = `${environment.api.url}/parameters/defaults`;
        return this.get<IParameter[]>(url);
    }

    getParameterIndexes(id: number): Observable<any[]> {
        const url = `${environment.api.url}/parametersets/${id}/indexes`;
        return this.get<any[]>(url);
    }

    getParameterIndexers(id: number): Observable<IndexerName[]> {
        const url = `${environment.api.url}/parametersets/${id}/indexers`;
        return this.get<any[]>(url);
    }

    getParameterSetDependencies(id: number): Observable<any[]> {
        const url = `${environment.api.url}/parametersets/${id}/dependencies`;
        return this.get<any[]>(url);
    }

    getStreamNetworkDependencies(id: number): Observable<any[]> {
        const url = `${environment.api.url}/networks/${id}/dependencies`;
        return this.get<any[]>(url);
    }

    getStreamNetworks(parameterSetId: number): Observable<StreamNetwork[]> {
        let url = `${environment.api.url}/parametersets`;

        if (parameterSetId) {
            url += `/${parameterSetId}`;
        }

        url += `/networks`;
        return this.get<StreamNetwork[]>(url);
    }

    upload(parameterSet: ParameterSet, filename: string, reference: string): Observable<any> {
        const url = `${environment.api.url}/parametersets?filename=${filename}&reference=${reference}`;
        return this.post<ParameterSet>(url, parameterSet);
    }

    update(parameterSet: ParameterSet, id: number, notes: string = null): Observable<any> {
        let url = `${environment.api.url}/parametersets/${id}`;

        if (notes) {
            url += `?notes=${notes}`;
        }

        return this.put<any>(url, parameterSet);
    }

    getLayout(id: number = null, parameterSetId: number = null): Observable<any[]> {
        let url = `${environment.api.url}/gui/layouts/parameters`;

        if (id) {
            url += `/${id}`;
        }

        if (parameterSetId) {
            url += `?parameterSetId=${parameterSetId}`;
        }

        return this.get<any[]>(url);
    }

    postStreamNetwork(body: ReachStructure): Observable<any> {
        const url = `${environment.api.url}/networks`;
        return this.post<any>(url, body);
    }

    postLayout(layout: any, reference: string, modelVersionCoreId: number): Observable<any> {
        const url = `${environment.api.url}/gui/layouts/parameters?reference=${reference}&modelVersionCoreId=${modelVersionCoreId}`;
        return this.post<any>(url, layout);
    }

    postMeta(body: any): Observable<ParameterSetMeta> {
        const url = `${environment.api.url}/parametersets/new`;
        return this.post<ParameterSetMeta>(url, body);
    }

    putStreamNetwork(parameterSetId: number, network: ReachStructure): Observable<ReachStructure> {
        const url = `${environment.api.url}/parametersets/${parameterSetId}/networks`;
        return this.put<ReachStructure>(url, network);
    }

    deleteParameterSet(id: number): Observable<any[]> {
        const url = `${environment.api.url}/parametersets/${id}`;
        return this.delete(url);
    }

    deleteStreamNetwork(id: number): Observable<any[]> {
        const url = `${environment.api.url}/networks/${id}`;
        return this.delete(url);
    }
}
