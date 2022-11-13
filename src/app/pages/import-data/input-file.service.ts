import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { InputData, ObservedDataTags, inputFileTypeEnum } from './input-upload/driving-data.model';
import { environment } from 'src/environments/environment';
import { RequestServiceBase } from '../shared/base-classes/RequestServiceBase';
import { InputDataFileMeta } from '../shared/models/input-data.model';
import { InputFileType } from './input-upload/input-type-select/input-type.model';
import { InputDataMeta } from '../dashboard/input-data-list/input-data-meta.model';
import { ReachStructure } from './structure-upload/models/ReachStructure';

@Injectable({
  providedIn: 'root'
})
export class InputFileService extends RequestServiceBase {

    private $inputFileMetaCache: Observable<InputDataFileMeta[]>;

    constructor (protected http: HttpClient) {
        super(http);
    }

    upload(
        fileTypeId: number,
        inputData: InputData,
        filename: string,
        reference: string,
        startDate: string,
        attribution: string = null,
        isDownloadable: number = null
    ): Observable<any> {
        let url = `${environment.api.url}/inputs?type=${fileTypeId}&filename=${filename}&reference=${reference}&startDate=${startDate}`;

        if (attribution) {
            url += `&attribution=${attribution}`;
        }

        if (isDownloadable) {
            url += `&downloadable=${isDownloadable}`;
        }

        return this.post<InputData>(url, inputData);
    }

    uploadStructure(structure: ReachStructure, filename: string, reference: string, parameterSetId: number): Observable<any> {
        let url = `${environment.api.url}/inputs`;
        url += `?type=${inputFileTypeEnum.STRUCTURE}&filename=${filename}&reference=${reference}&parameterSetId=${parameterSetId}`;
        return this.post<InputData>(url, structure);
    }

    getInputs(id: number = null, downloadable: boolean = null): Observable<InputDataFileMeta[]> {
//        if (!this.$inputFileMetaCache) {
//            this.$inputFileMetaCache = this.requestInputsMeta(id).pipe(
//                shareReplay()
//            );
//        }
//        return this.$inputFileMetaCache;
        return this.requestInputsMeta(id, downloadable);
    }

    requestInputsMeta(fileTypeId: number, downloadable: boolean = null): Observable<InputDataFileMeta[]> {
        let url = `${environment.api.url}/inputs`;

        if (fileTypeId) {
            url += `/types/${fileTypeId}`;
        }

        url += `/meta`;

        if (downloadable) {
            url += `?downloadable=${downloadable}`;
        }

        return this.get<InputDataFileMeta[]>(url);
    }

    getInputFileTypes(): Observable<InputFileType[]> {
        const url = `${environment.api.url}/inputs/types`;
        return this.get<InputFileType[]>(url);
    }

    getOptionalFileTypeInfo(parameterSetId: number): Observable<InputFileType[]> {
        const url = `${environment.api.url}/inputs/types?optional&id=${parameterSetId}`;
        return this.get<InputFileType[]>(url);
    }

    getInputFileMeta(typeId: number): Observable<InputDataMeta[]> {
        const url = `${environment.api.url}/inputs/types/${typeId}/meta`;
        return this.get<InputDataMeta[]>(url);
    }

    getInputFileDependencies(id: number): Observable<any[]> {
        const url = `${environment.api.url}/inputs/${id}/dependencies`;
        return this.get<any[]>(url);
    }

    getObservedDataTags(): Observable<ObservedDataTags[]> {
        const url = `${environment.api.url}/inputs/observed/tags`;
        return this.get<ObservedDataTags[]>(url);
    }

    deleteInputFile(id: number): Observable<any[]> {
        const url = `${environment.api.url}/inputs/${id}`;
        return this.delete(url);
    }
}
