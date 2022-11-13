import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ParameterService } from 'src/app/pages/parameters/parameter.service';
import { MatDialog } from '@angular/material/dialog';
import { xml2js } from 'xml-js';
import { XML_OPTIONS } from 'src/app/app.constants';
import { ModelVersion } from 'src/app/pages/simulation/models/model-setup.model';

@Component({
  selector: 'slu-gui-layout-upload',
  templateUrl: './gui-layout-upload.component.html',
  styleUrls: ['./gui-layout-upload.component.scss']
})
export class GuiLayoutUploadComponent implements OnInit {

  layoutUploadForm: FormGroup;
  layout: any;
  isUploading = false;
  modelVersionCoreId: number = null;

  constructor(private fb: FormBuilder,
              private parameterService: ParameterService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.layoutUploadForm = this.fb.group({
      'reference': [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(45),
        ]),
      ],
    });
  }

  getReferenceError() {
    return (
      this.layoutUploadForm.controls.reference.hasError('required') ? 'You must enter a reference' :
      this.layoutUploadForm.controls.reference.hasError('minlength') ? 'The reference is too short' :
      this.layoutUploadForm.controls.reference.hasError('maxlength') ? 'The reference is too long' :
      ''
    );
  }

  onSubmit() {
    this.upload(this.layout);
  }

  onFileContentsChange(fileContents: any) {
    this.layout = xml2js(fileContents['contents'], XML_OPTIONS);
  }

  onModelVersionSelect(version: ModelVersion) {
    this.modelVersionCoreId = version.modelVersionCoreId;
  }

  upload(layout: any) {
    this.isUploading = true;

    const reference = this.layoutUploadForm.value.reference;
    this.parameterService
        .postLayout(layout.DisplaySet.Parameters, reference, this.modelVersionCoreId)
        .subscribe(
          json => {
            this.isUploading = false;
          },
        );
  }

}
