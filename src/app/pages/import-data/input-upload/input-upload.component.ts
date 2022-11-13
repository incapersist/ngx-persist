import { Component, OnInit, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { DrivingData, InputData, AbstractionData, EffluentData, ObservedData, PetData, inputFileTypeEnum, ObservedDataTags } from './driving-data.model';
import { InputFileService } from '../input-file.service';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { ReferenceValidators } from '../../shared/validators/file-reference-validator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InputFileType } from './input-type-select/input-type.model';
import { ParameterSetMeta } from '../../parameters/models/parameter-set';
import * as moment from 'moment';
import { ParameterService } from '../../parameters/parameter.service';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'slu-dialog-input-file-uploaded',
  templateUrl: 'dialog-input-file-uploaded.html',
})
export class DialogInputFileUploadedComponent {
  constructor(public dialogRef: MatDialogRef<DialogInputFileUploadedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'slu-dialog-permission',
  templateUrl: 'dialog-permission.html',
})
export class DialogPermissionComponent {

  constructor(public dialogRef: MatDialogRef<DialogPermissionComponent>) { }
}

@Component({
  selector: 'slu-input-upload',
  templateUrl: './input-upload.component.html',
})
export class InputUploadComponent implements OnInit {

  @Output() complete = new EventEmitter<boolean>();
  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;

  inputData: InputData;
  inputUploadForm: FormGroup;
  filename: string;
  fileTypeExtension = '.dat';
  private fileTypeId = inputFileTypeEnum.HYDROLOGY;
  parameterSet: ParameterSetMeta;
  private indexes: any[];
  isUploading = false;
  observedDataTags: ObservedDataTags[];
  hasDailyStepSize = true;
  referenceId: string = uuid();
  startDateId: string = uuid();

  constructor(private validatorService: ReferenceValidators,
              private inputFileService: InputFileService,
              private parameterService: ParameterService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.formSetup();
  }

  formSetup() {
    this.inputUploadForm = new FormGroup({
      'reference': new FormControl(
        null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ],
        asyncValidators: [this.validatorService.referenceValidator(this.fileTypeId)],
        updateOn: 'blur'
      }),
      'startDate': new FormControl(
        null, {
        validators: [
          Validators.required
        ],
      }),
      'startTime': new FormControl(
        null, {
        validators: [
          Validators.required
        ],
      }),
      'permission': new FormControl(false, Validators.requiredTrue),
      'attribution': new FormControl(),
      'downloadable': new FormControl(),
    });
  }

  getReferenceError() {
    return (
      this.inputUploadForm.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.inputUploadForm.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.inputUploadForm.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      this.inputUploadForm.controls.reference.hasError('referenceExists') ? 'A file with this reference already exists' :
      ''
    );
  }

  getStartDateError() {
    return (
      this.inputUploadForm.controls.startDate.hasError('required') ? 'You must enter a start date' :
      ''
    );
  }

  onPermissionClick(e) {
    const dialogRef = this.dialog.open(DialogPermissionComponent, {
      width: '400px'
    });

    return false;
  }

  onSubmit() {
    this.upload(this.filename);
  }

  onFileContentsChange(fileContents: any) {
    this.complete.emit(false);
    this.filename = fileContents['filename'];

    switch (this.fileTypeId) {
      case inputFileTypeEnum.HYDROLOGY:   this.inputData = new DrivingData(); break;
      case inputFileTypeEnum.OBSERVED:    this.inputData = new ObservedData(this.observedDataTags, this.hasDailyStepSize); break;
      case inputFileTypeEnum.EFFLUENT:    this.inputData = new EffluentData(this.parameterSet.timesteps); break;
      case inputFileTypeEnum.ABSTRACTION: this.inputData = new AbstractionData(this.parameterSet.timesteps); break;
      case inputFileTypeEnum.PET:         this.inputData = new PetData(
                                                                        this.parameterSet.timesteps,
                                                                        null,
                                                                        this.extractIndexes('Landscape units')
                                                                      );
                                          break;
    }

    const ii = this.indexes.reduce((acc, val) => acc.concat(Object.values(val)), [])
                            .reduce((acc, val) => acc.concat(val), [])
                            .map(x => x.reference);

    // Split the single 'contents' string into rows at newline characters
    // Remove any blank lines
    // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
    const rows = fileContents['contents'].split(/\r?\n/).filter(x => !!x.trim());

    try {
      this.inputData.parseTextFileContents(rows, ii);
    } catch (error) {
      this.resetForm();
      throw(error);
    }
  }

  onFileTypeSelect(fileType: InputFileType) {
    this.fileTypeExtension = fileType.legacy_extension;
    this.fileTypeId = +fileType.id;

    // Make sure that the reference validator has the latest input file type ID...
    this.inputUploadForm.controls.reference.asyncValidator = this.validatorService.referenceValidator(this.fileTypeId);
    // then force the reference validator to fire. This ensures that the reference
    // validity is checked if the reference value is already non-null when
    // the file type is changed
    this.inputUploadForm.controls.reference.updateValueAndValidity();

    this.inputData = null;
    this.filename = null;
    this.inputUploadForm.controls['filename'].reset();

    if (this.fileTypeId === inputFileTypeEnum.OBSERVED) {
      this.getObservedDataTags();
    }
  }

  getObservedDataTags() {
      this.inputFileService
          .getObservedDataTags()
          .subscribe(res => {
            this.observedDataTags = res;
          });
  }

  onParameterSetSelect(parameterSet: ParameterSetMeta) {
    this.parameterSet = parameterSet;

    this.hasDailyStepSize = ((this.parameterSet.stepSize % 86400) === 0);

    if (!this.inputUploadForm.controls.reference.value) {
      this.inputUploadForm.controls.reference.setValue(this.parameterSet.reference);
    }

    this.parameterService
        .getParameterIndexes(+this.parameterSet.id)
        .subscribe(res => {
          this.indexes = JSON.parse(res[0]['result']);
        });

    const startDate = moment(parameterSet.startDate, 'YYYY-MM-DD HH:mm:ss');
    this.inputUploadForm.controls.startDate.setValue(startDate);
    this.inputUploadForm.controls.startTime.setValue(startDate.format('hh:mm a'));
  }

  extractIndexes(indexerName: string): string[] {
    const ii = this.indexes.filter(x => Object.keys(x)[0] === indexerName);
    return ii[0][indexerName].map(x => x.reference);
  }

  upload(filename: string) {
    this.isUploading = true;

    const newStartDate = this.inputUploadForm.value.startDate.format('YYYY-MM-DD');
    const newStartTime = this.inputUploadForm.value.startTime;
    const startDate = moment(`${newStartDate} ${newStartTime}`, 'YYYY-MM-DD hh:mm a').format('YYYY-MM-DD HH:mm:ss');

    const reference = this.inputUploadForm.value.reference;
    const attribution = this.inputUploadForm.value.attribution;
    const isDownloadable = this.inputUploadForm.value.downloadable ? 1 : 0;

    this.inputFileService
        .upload(this.fileTypeId, this.inputData, filename, reference, startDate, attribution, isDownloadable)
        .subscribe(
          res => {
            if (res === 'File already exists') {
              this.complete.emit(false);
              this.openDialog(false);
            } else {
              this.complete.emit(true);
              this.openDialog();
            }
          },
        );
  }

  openDialog(wasImported: boolean = true): void {
    const dialogRef = this.dialog.open(DialogInputFileUploadedComponent, {
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
