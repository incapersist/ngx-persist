import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Subject, Subscription, timer } from 'rxjs';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { mergeMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PollingService extends RequestServiceBase implements OnDestroy {

    private progressSub: Subscription;
    private progress: number;

    progressSubject = new Subject<number>();

    constructor (protected http: HttpClient) {
        super(http);
    }

    ngOnDestroy() {
        this.stopProgressPolling();
    }

    getProgress(url: string) {
        return this.get<any[]>(url);
    }

    startProgressPolling(url: string, pollPeriod: number = 500) {
        if (!this.progressSub || this.progressSub.closed) {
            this.progressSub = timer(0, pollPeriod)
                                .pipe(mergeMapTo(this.getProgress(url)))
                                .subscribe((progress) => {
                                    this.progress = +progress;
                                    this.progressSubject.next(this.progress);
                                });
        } else {
            this.progressSubject.next(this.progress);
        }
    }

    stopProgressPolling() {
        if (this.progressSub) {
            this.progressSub.unsubscribe();
        }
    }
}
