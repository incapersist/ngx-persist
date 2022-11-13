import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { IParameter } from '../../../models/parameter-set';
import { ParameterService } from '../../../parameter.service';
import { Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ParameterEditFormStatusService } from '../../../parameter-edit-form-status.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'slu-parameter-edit',
  templateUrl: './parameter-edit.component.html',
  styleUrls: ['./parameter-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ParameterEditComponent implements OnInit, OnDestroy {

  @Input() parentForm: FormGroup;
  @Input() parameter: IParameter;
  @Input() showTitle = true;
  @Input() showHelp = true;
  @Input() width = 230;

  private control: AbstractControl;
  controlTypeId: number;
  private sub: Subscription;
  ref: string;
  isSetupComplete = false;

  constructor(private service: ParameterService, private statusService: ParameterEditFormStatusService) { }

  ngOnInit() {
    this.fillParameter();
    this.formSetup();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  fillParameter() {
    const defaultParameter = this.service.defaultParameter(+this.parameter.id);
    if (defaultParameter) {
      this.controlTypeId = +defaultParameter.controlTypeId;
      this.parameter.units = defaultParameter.units;
      this.parameter.defaultValue = defaultParameter.defaultValue;
      this.parameter.maximumValue = defaultParameter.maximumValue;
      this.parameter.minimumValue = defaultParameter.minimumValue;
    } else {
      this.controlTypeId = 1;
    }
  }

  formSetup() {
    this.ref = uuid();
    this.control = this.parentForm.registerControl(
      this.ref, new FormControl(
        [
          Validators.required,
          Validators.min(this.parameter.minimumValue),
          Validators.max(this.parameter.maximumValue)
        ]
      )
    );

    // https://stackoverflow.com/questions/46090554/how-to-correctly-2-way-bind-with-reactive-forms
    this.sub = this.control.valueChanges.subscribe((change) => this.updateValue(change));
    this.isSetupComplete = true;
  }

  updateValue(value) {
    if (this.isSetupComplete && this.parameter.currentValue != value) {
      this.parameter.currentValue = value;
      this.statusService.changed(true, this.parameter);
    }
  }

  onCheckChange(e: MatCheckboxChange) {
    this.statusService.changed(true, this.parameter);
  }

  reset() {
    this.control.setValue(this.parameter.defaultValue);
  }
}
