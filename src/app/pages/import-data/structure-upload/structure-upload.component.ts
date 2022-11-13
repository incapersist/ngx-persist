import { Component, OnInit, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { InputFileService } from '../input-file.service';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { ReferenceValidators } from '../../shared/validators/file-reference-validator';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParameterSetMeta } from '../../parameters/models/parameter-set';
import { ParameterService } from '../../parameters/parameter.service';
import { inputFileTypeEnum } from '../input-upload/driving-data.model';
import { ReachStructure } from './models/ReachStructure';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'slu-dialog-structure-file-uploaded',
  templateUrl: 'dialog-structure-file-uploaded.html',
})
export class DialogStructureFileUploadedComponent {
  constructor(public dialogRef: MatDialogRef<DialogStructureFileUploadedComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
}

@Component({
  selector: 'slu-structure-upload',
  templateUrl: './structure-upload.component.html',
  styleUrls: ['./structure-upload.component.scss']
})
export class StructureUploadComponent implements OnInit {

  @Output() complete = new EventEmitter<boolean>();
  @ViewChild('formDirective', {static: false}) private formDirective: NgForm;

  structure: ReachStructure;
  structureUploadForm: FormGroup;
  filename: string;
  fileTypeExtension = '.ssf';
  private parameterSet: ParameterSetMeta;
  private indexes: any[];
  isUploading = false;
  referenceId = uuid();

  constructor(private validatorService: ReferenceValidators,
              private inputFileService: InputFileService,
              private parameterService: ParameterService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.formSetup();
  }

  formSetup() {
    this.structureUploadForm = new FormGroup({
      'reference': new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ],
        asyncValidators: [this.validatorService.referenceValidator(inputFileTypeEnum.STRUCTURE)],
        updateOn: 'blur'
      })
    });
  }

  getReferenceError() {
    return (
      this.structureUploadForm.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.structureUploadForm.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.structureUploadForm.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      this.structureUploadForm.controls.reference.hasError('referenceExists') ? 'A file with this reference already exists' :
      ''
    );
  }

  onSubmit() {
    this.upload(this.filename);
  }

  onFileContentsChange(fileContents: any) {
    this.complete.emit(false);
    this.filename = fileContents['filename'];

    // Split the single 'contents' string into rows at newline characters
    // Remove any blank lines
    // https://stackoverflow.com/questions/21895233/how-in-node-to-split-string-by-newline-n
    const rows = fileContents['contents'].split(/\r?\n/).filter(x => !!x.trim());

    this.structure = new ReachStructure();

    try {
    this.structure.import(rows);
    } catch (error) {
      this.resetForm();
      throw(error);
    }

    if (!this.structure.reachIndexesMatch(this.indexes)) {
      throw new Error('Structure file import error: Structure file reach names do not match parameter set reach names');
    }
  }

  onParameterSetSelect(parameterSet: ParameterSetMeta) {
    this.parameterSet = parameterSet;

    if (!this.structureUploadForm.controls.reference.value) {
      this.structureUploadForm.controls.reference.setValue(this.parameterSet.reference);
    }

    this.parameterService
        .getParameterIndexes(+this.parameterSet.id)
        .subscribe(res => {
          this.indexes = JSON.parse(res[0]['result']);
        });
  }

  upload(filename: string) {
    this.isUploading = true;

    const reference = this.structureUploadForm.value.reference;

    this.inputFileService
        .uploadStructure(this.structure, filename, reference, this.parameterSet.id)
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
    const dialogRef = this.dialog.open(DialogStructureFileUploadedComponent, {
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
