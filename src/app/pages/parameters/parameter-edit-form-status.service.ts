import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IParameter } from './models/parameter-set';

@Injectable({
  providedIn: 'root'
})
export class ParameterEditFormStatusService  {
    private isSaved = new Subject<any>();
    isSaved$ = this.isSaved.asObservable();

    private isValueChanged = new Subject<any>();
    isValueChanged$ = this.isValueChanged.asObservable();

    changed(isChanged: boolean = true, parameter: IParameter) {
        this.isValueChanged.next({isChanged, parameter});
    }

    saved(isSaved: boolean) {
        this.isSaved.next(isSaved);
        if (isSaved) {
            this.changed(false, null);
        }
    }
}