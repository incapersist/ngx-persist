// https://stackblitz.com/edit/angular-reactive-forms-async-validator?file=src%2Fapp%2Fvalidators%2Fuser.validator.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReferenceValidators {

  constructor(private http: HttpClient) {}

  searchReference(reference: string, inputFileTypeId: number) {
    if (reference && inputFileTypeId) {
      const url = `${environment.api.url}/inputs/references?ref=${reference}&type=${inputFileTypeId}`;
      // debounce
      return timer(1000)
        .pipe(
          switchMap(() => {
            // Check if reference is available
            return this.http.get<any>(url);
          })
        );
    }
  }

  referenceValidator(inputFileTypeId: number): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      return this.searchReference(control.value, inputFileTypeId)
        .pipe(
          map(res => {
            // if reference is already taken
            if (res.length) {
              // return error
              return { 'referenceExists': true};
            }
          })
        );
    };
  }
}
