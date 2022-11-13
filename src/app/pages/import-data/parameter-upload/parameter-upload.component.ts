import { Component, OnInit, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { ParameterSet, ParameterSetMeta } from '../../parameters/models/parameter-set';
import { ParameterService } from '../../parameters/parameter.service';
import { xml2js } from 'xml-js';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenceValidators } from '../../shared/validators/file-reference-validator';
import { XML_OPTIONS } from 'src/app/app.constants';
import * as moment from 'moment';
import { inputFileTypeEnum } from '../input-upload/driving-data.model';
import { v4 as uuid } from 'uuid';
import { SimulationService } from '../../simulation/simulation.service';
import { ModelVersion } from '../../simulation/models/model-setup.model';

@Component({
  selector: 'slu-dialog-parameter-file-uploaded',
  templateUrl: 'dialog-parameter-file-uploaded.html',
})
export class DialogParameterFileUploadedComponent {

  constructor(public dialogRef: MatDialogRef<DialogParameterFileUploadedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'slu-parameter-upload',
  templateUrl: './parameter-upload.component.html',
  styleUrls: ['./parameter-upload.component.scss']
})
export class ParameterUploadComponent implements OnInit {

  @Output() complete = new EventEmitter<boolean>();
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;

  parameterSets: ParameterSet[];
  parameterUploadForm: FormGroup;
  parset: any;
  filename: string;
  isUploading = false;
  referenceId: string = uuid();
  modelVersions: ModelVersion[];
  uploadVersion: ModelVersion;

  constructor(private parameterService: ParameterService,
              private validatorService: ReferenceValidators,
              private simulationService: SimulationService,
              public dialog: MatDialog) {
    this.parameterSets = [];
  }

  ngOnInit() {
    this.formSetup();
    this.getModelVersions();
  }

  formSetup() {
    this.parameterUploadForm = new FormGroup({
      'reference': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ],
        asyncValidators: [this.validatorService.referenceValidator(inputFileTypeEnum.PARAMETER)],
        updateOn: 'blur'
      })
    });
  }

  getModelVersions() {
    this.simulationService
        .getModelVersions(false)
        .subscribe(res => {
          this.modelVersions = res;
        });
  }

  getReferenceError() {
    return (
      this.parameterUploadForm.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.parameterUploadForm.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.parameterUploadForm.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      this.parameterUploadForm.controls.reference.hasError('referenceExists') ? 'A parameter set with this reference already exists' :
      ''
    );
  }

  onSubmit() {
    this.upload(this.parset, this.filename);
  }

  onFileContentsChange(fileContents: any) {
    this.complete.emit(false);
    this.parset = xml2js(fileContents['contents'], XML_OPTIONS);

    this.checkVersion();

    this.filename = fileContents['filename'];
  }

  checkVersion() {
    const version = this.parset.ParameterSet._attributes.version;

    if (this.modelVersions && this.modelVersions.length) {
      const match = this.modelVersions.filter(x => x.version === version);

      if (match.length > 0) {
        this.uploadVersion = match[0];
        // Check if version is currently in use
      } else {
        this.resetForm();
        throw Error(`'${version}' is not a known model version. Parameter set cannot be uploaded`);
      }
    }
  }

  upload(parset: any, filename: string) {
    this.isUploading = true;

    if (!this.uploadVersion) {
      this.checkVersion();
    }

    const reference = this.parameterUploadForm.value.reference;
    this.parameterService
        .upload(parset, filename, reference)
        .subscribe(
          json => {
            if (json === 'File already exists') {
              this.complete.emit(false);
              this.openDialog(false);
            } else {
              this.complete.emit(true);
              this.openDialog();

              this.publishMeta(+json, parset, reference);
            }
          },
          err => {
            this.resetForm();
    //        throw(err);
          }
        );
  }

  private publishMeta(id: number, parset: any, reference: string) {
    const system = parset.ParameterSet.ParameterContainer.ParameterGroup[0].ParameterContainer;

    let stepSize = 86400;
    let timesteps = system.Parameter[0].currentValue._text;
    let startDate = system.Parameter[1].currentValue._text;

    if (system.Parameter[0]._attributes.name === 'Step size') {
      stepSize = system.Parameter[0].currentValue._text;
      timesteps = system.Parameter[1].currentValue._text;
      startDate = system.Parameter[2].currentValue._text;
    }

    startDate = moment(startDate, 'DD/MM/YYYY HH:mm:ss');

    const meta: ParameterSetMeta = {
      id: id,
      reference: reference,
      startDate: startDate.format('YYYY-MM-DD HH:mm:ss'),
      timesteps: timesteps,
      stepSize: stepSize,
      modelVersion: this.uploadVersion.version,
      lastEditDate: null,
      modelVersionId: this.uploadVersion.id
    };

    this.parameterService.emitNewParameterSetMeta(meta);
  }

  openDialog(wasImported: boolean = true): void {
    const dialogRef = this.dialog.open(DialogParameterFileUploadedComponent, {
      width: '350px',
      data: { success: wasImported },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.resetForm();
    });
  }

  resetForm() {
    this.formDirective.resetForm();
    this.isUploading = false;
  }
}
