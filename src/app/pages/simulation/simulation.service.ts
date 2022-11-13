import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, Subject, Subscription, timer, throwError } from 'rxjs';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { IndexMeta } from '../shared/models/index.model';
import { ModelSetupMeta, ResultSize, ModelVersion } from './models/model-setup.model';
import { mergeMapTo, catchError } from 'rxjs/operators';
import { ModelError } from './models/model-error';
import { environment } from 'src/environments/environment';
import { IndexerName } from './models/indexer';

@Injectable({
  providedIn: 'root'
})
export class SimulationService extends RequestServiceBase {

    private newModelSetup = new Subject<any>();
    private runProgressSub: Subscription;
    private saveProgressSub: Subscription;
    private archiveProgressSub: Subscription;

    newModelSetup$ = this.newModelSetup.asObservable();
    runProgressSubject = new Subject<number>();
    runProgress: number;
    saveProgressSubject = new Subject<number>();
    saveProgress: number;
    runCompleteSubject = new Subject<number>();
    archiveProgressSubject = new Subject<number>();
    archiveProgress: number;

    private $modelSetupMetaCache: Observable<ModelSetupMeta[]>;

    constructor (protected http: HttpClient) {
        super(http);
    }

    emitNewModelSetup(modelSetup: any) {
        this.newModelSetup.next(modelSetup);
    }

    getResultsLevels(): Observable<ResultSize[]> {
        const url = `${environment.api.url}/results/levels`;
        return this.get<ResultSize[]>(url);
    }

    getIndexes(modelRunId: number = null, indexerId: number = null): Observable<IndexMeta[]> {
        let url = `${environment.api.url}/runs`;

        if (modelRunId) {
            url += `/${modelRunId}`;
        }

        url += `/indexers`;

        if (indexerId) {
            url += `/${indexerId}`;
        }

        url += `/indexes`;

        return this.get<IndexMeta[]>(url);
    }

    getModelSetups(parameterSetId: number = null, resultsRequired: boolean = false): Observable<ModelSetupMeta[]> {
        let url = `${environment.api.url}/runs?results=${resultsRequired}`;

        if (parameterSetId) {
            url += `&parameterSetId=${parameterSetId}`;
        }

        return this.get<ModelSetupMeta[]>(url);
    }

    getModelSetupDependencies(id: number): Observable<any[]> {
        const url = `${environment.api.url}/runs/${id}/dependencies`;
        return this.get<any[]>(url);
    }

    getModelVersions(isAvailable: boolean = true): Observable<ModelVersion[]> {
        let url = `${environment.api.url}/versions`;

        if (isAvailable) {
            url += `?isAvailable=${isAvailable}`;
        }

        return this.get<ModelVersion[]>(url);
    }

    getModelIndexers(versionId: number): Observable<IndexerName[]> {
        const url = `${environment.api.url}/versions/${versionId}/indexers`;
        return this.get<IndexerName[]>(url);
    }

    getResultLevelAvailability(modelRunId: number, level: number = null): Observable<any[]> {
        let url = `${environment.api.url}/runs/${modelRunId}/levels`;

        if (level) {
            url += `/${level}`;
        }

        return this.get<any[]>(url);
    }

    postModelRun(modelRun: any): Observable<any> {
        const url = `${environment.api.url}/runs`;
        return this.post<any>(url, modelRun);
    }

    run(runId: number, outputSize: string = 'small'): Observable<number | ModelError> {
        const url = `${environment.api.url}/runs/${runId}?size=${outputSize}`;
        const body = JSON.stringify(runId);
        return this.post<number>(url, body)
            .pipe(
                catchError(this.handleModelError)
            );
    }

    runComplete(runId: number) {
        this.runCompleteSubject.next(runId);
    }

    handleModelError(error: HttpErrorResponse): Observable<any> {
        const modelError = new ModelError();
        modelError.userMessage = error.statusText;
        return throwError(modelError);
    }

    getRunProgress(runId: number) {
        const url = `${environment.api.url}/runs/${runId}/progress`;
        return this.get<any[]>(url);
    }

    deleteRunProgress(runId: number) {
        const url = `${environment.api.url}/runs/${runId}/progress`;
        return this.delete(url);
    }

    getSaveProgress(runId: number) {
        const url = `${environment.api.url}/runs/${runId}/saveprogress`;
        return this.get<any[]>(url);
    }

    getArchiveProgress(runId: number) {
        const url = `${environment.api.url}/runs/${runId}/results/archiveprogress`;
        return this.get<any[]>(url);
    }


    startRunProgressPolling(runId: number) {
        if (!this.runProgressSub || this.runProgressSub.closed) {
            this.runProgressSub = timer(0, 250)
                                .pipe(mergeMapTo(this.getRunProgress(runId)))
                                .subscribe((runProgress) => {
                                    this.runProgress = +runProgress;
                                    this.runProgressSubject.next(this.runProgress);
                                });
        } else {
            this.runProgressSubject.next(this.runProgress);
        }
    }

    stopRunProgressPolling() {
        if (this.runProgressSub) {
            this.runProgressSub.unsubscribe();
        }
    }

    startSaveProgressPolling(runId: number) {
        if (!this.saveProgressSub || this.saveProgressSub.closed) {
            this.saveProgress = 0;
            this.saveProgressSub = timer(0, 500)
                                .pipe(mergeMapTo(this.getSaveProgress(runId)))
                                .subscribe((saveProgress) => {
                                    this.saveProgress = +saveProgress;
                                    this.saveProgressSubject.next(this.saveProgress);
                                });
        } else {
            this.saveProgressSubject.next(this.saveProgress);
        }
    }

    stopSaveProgressPolling() {
        if (this.saveProgressSub) {
            this.saveProgressSub.unsubscribe();
        }
    }

    startArchiveProgressPolling(runId: number) {
        if (!this.archiveProgressSub || this.archiveProgressSub.closed) {
            this.archiveProgress = 0;
            this.archiveProgressSub = timer(0, 500)
                                .pipe(mergeMapTo(this.getArchiveProgress(runId)))
                                .subscribe((archiveProgress) => {
                                    this.archiveProgress = +archiveProgress;
                                    this.archiveProgressSubject.next(this.archiveProgress);
                                });
        } else {
            this.archiveProgressSubject.next(this.archiveProgress);
        }
    }

    stopArchiveProgressPolling() {
        if (this.archiveProgressSub) {
            this.archiveProgressSub.unsubscribe();
        }
    }

    deleteModelSetup(id: number): Observable<any[]> {
        const url = `${environment.api.url}/runs/${id}`;
        return this.delete(url);
    }
}
