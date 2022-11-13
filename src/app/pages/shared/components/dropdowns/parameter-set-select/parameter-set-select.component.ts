import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ParameterService } from '../../../../parameters/parameter.service';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParameterSetMeta } from '../../../../parameters/models/parameter-set';

@Component({
  selector: 'slu-parameter-set-select',
  templateUrl: './parameter-set-select.component.html',
  styleUrls: ['./parameter-set-select.component.scss']
})
export class ParameterSetSelectComponent implements OnInit, OnChanges {

  @Input() parentForm: FormGroup;
  @Input() selectedId: number = null;
  @Output() parameterSet = new EventEmitter<ParameterSetMeta>();

  parameterSets: ParameterSetMeta[];
  selected: ParameterSetMeta;

  constructor(private service: ParameterService) { }

  ngOnInit() {
    this.formSetup();
    this.getParameterSetInfo();
    this.service.newParameterSetMeta$.subscribe(res => this.addNewMeta(res));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedId'] && changes['selectedId'].currentValue) {
      this.setSelected(+this.selectedId);
    }
  }

  formSetup() {
    this.parentForm.addControl('parameterSetId', new FormControl('', Validators.required));
  }

  getParameterSetInfo() {
    this.service
        .getParameterSetMeta()
        .subscribe(res => {
          this.parameterSets = res;

          if (this.selectedId) {
            this.setSelected(this.selectedId);
          }
        });
  }

  setSelected(id: number) {
    if (this.parameterSets && this.parameterSets.length > 0) {
      this.selected = this.parameterSets.find(x => +x.id === id);
      this.parentForm.controls.parameterSetId.setValue(this.selected.id);
    }
  }

  onParameterSetSelect(e: MatSelectChange) {
    this.selectParameterSet(+e.value);
  }

  selectParameterSet(id: number) {
    this.setSelected(id);
    this.parameterSet.emit(this.selected);
  }

  getError() {
    return this.parentForm.controls.parameterSetId.hasError('required') ? 'You must select a parameter set' :
            '';
  }

  addNewMeta(meta: ParameterSetMeta, autoSelect: boolean = false) {
    const exists = this.parameterSets.find(x => +x.id === +meta.id);
    if (!exists) {
      this.parameterSets.unshift(meta);
    }

    if (autoSelect) {
      this.selectParameterSet(+meta.id);
      this.parentForm.controls.parameterSetId.setValue(this.selected.id);
    }
  }
}
