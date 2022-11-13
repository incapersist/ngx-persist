import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { InputFileType } from './input-type.model';
import { InputFileService } from '../../input-file.service';

@Component({
  selector: 'slu-input-type-select',
  templateUrl: './input-type-select.component.html',
  styleUrls: ['./input-type-select.component.scss']
})
export class InputTypeSelectComponent implements OnInit {

  @Output() type = new EventEmitter<InputFileType>();

  inputTypes: InputFileType[] = null;
  selectedType: InputFileType = null;

  constructor(private inputFileService: InputFileService) { }

  ngOnInit() {
    this.getOptions();
  }

  getOptions() {
    this.inputFileService
        .getInputFileTypes()
        .subscribe(res => {
          this.inputTypes = res;
          this.selectedType = this.inputTypes[0];
        });
  }

  onTypeSelect(e: MatSelectChange) {
    const id: number = +e.value;
    this.selectedType = this.inputTypes.find(x => +x.id === id);
    this.type.emit(this.selectedType);
  }
}
