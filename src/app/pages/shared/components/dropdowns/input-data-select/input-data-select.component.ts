import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { InputFileService } from '../../../../import-data/input-file.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InputDataFileMeta } from '../../../models/input-data.model';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'slu-input-data-select',
  templateUrl: './input-data-select.component.html',
  styleUrls: ['./input-data-select.component.scss']
})
export class InputDataSelectComponent implements OnInit {

  @Input() fileType = 1;
  @Input() parentForm: FormGroup;
  @Input() title = 'Driving data';
  @Input() required = true;
  @Input() ref: string = uuid();
  @Input() downloadable: boolean = null;

  @Output() inputs = new EventEmitter<any>();

  inputData: InputDataFileMeta[];
  selected: InputDataFileMeta;

  constructor(private service: InputFileService) { }

  ngOnInit() {
    this.formSetup();
    this.getInputDataInfo();
  }

  getInputDataInfo() {
    this.service
        .getInputs(this.fileType, this.downloadable)
        .subscribe(res => {
          this.inputData = res;
        });
  }

  formSetup() {
    if (this.required) {
      this.parentForm.addControl(this.ref, new FormControl('', Validators.required));
    } else {
      this.parentForm.addControl(this.ref, new FormControl({}));
      // Instantiating a FormControl with an empty object  ^
      // makes sure there are no validators attached
    }
  }

  onInputDataSelect(e: MatSelectChange) {
    this.selected = this.inputData.find(x => +x.id === +e.value);
    this.inputs.emit(this.selected);
  }

  getError() {
    return this.parentForm.controls[this.ref].hasError('required') ? 'You must select a data set' :
            '';
  }
}
