// https://stackblitz.com/edit/angular-reactive-forms-async-validator?file=src%2Fapp%2Fvalidators%2Fuser.validator.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncValidatorFn, FormGroup } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap  } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModelSetupValidators {

  constructor(private http: HttpClient) {}

  searchModelSetup(group: FormGroup) {
    const psId = group.controls['parameterSetId'].value || null;
    const ifId = group.controls['inputDataId'].value || null;

    // Optional input files
    const obId = this.getControlValue(group.controls, 'observed_data');
    const efId = this.getControlValue(group.controls, 'effluent_data');
    const abId = this.getControlValue(group.controls, 'abstraction_data');
    const etId = this.getControlValue(group.controls, 'input_pet_data');

    let sd = null;
    if (group.controls['startDate'] && !group.controls['startDate'].invalid) {
      sd = group.controls['startDate'].value.format('YYYY-MM-DD');
    }
    const ts = group.controls['timesteps'].value || null;

    const url = `${environment.api.url}/setups?ps=${psId}&if=${ifId}&sd=${sd}&ts=${ts}&ob=${obId}&ef=${efId}&ab=${abId}&et=${etId}`;

    // debounce
    return timer(1000)
      .pipe(
        switchMap(() => {
          // Check if reference is available
          return this.http.get<any>(url);
        })
      );
  }

  getControlValue(controls, name: string) {
    return (controls[name] && !this.isEmpty(controls[name].value)) ? controls[name].value : null;
  }

  isEmpty(obj) {
      for(var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              return false;
          }
      }

      return JSON.stringify(obj) === JSON.stringify({});
  }

  modelSetupValidator(): AsyncValidatorFn {
    return (group: FormGroup): Observable<{ [key: string]: any } | null> => {
      return this.searchModelSetup(group)
        .pipe(
          map(res => {
            // if reference is already taken
            if (res.length) {
              // return error
              return { 'referenceExists': true};
            }
          },
          err => 'ERROR!')
        );
    };
  }
}
