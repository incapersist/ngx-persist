import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Reach } from 'src/app/pages/import-data/structure-upload/models/Stream';
import { v4 as uuid } from 'uuid';
import { MatSelectChange } from '@angular/material/select';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'slu-reach-node-select',
  templateUrl: './reach-node-select.component.html',
  styleUrls: ['./reach-node-select.component.scss']
})
export class ReachNodeSelectComponent implements OnInit, OnChanges {

  @Input() parentForm: FormGroup = null;
  @Input() ref: string = uuid();
  @Input() reaches: Reach[];
  @Input() title = 'Reaches';
  @Input() disabled = false;
  @Input() showNoneOption = true;

  @Output() selected = new EventEmitter<Reach>();

  constructor() {}

  ngOnInit() {
    this.formSetup();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['disabled'] && this.parentForm.controls[this.ref]) {
      if (this.disabled) {
        this.parentForm.controls[this.ref].disable();
      } else {
        this.parentForm.controls[this.ref].enable();
      }
    }
  }

  formSetup() {
    this.parentForm.addControl(this.ref, new FormControl({value: '', disabled: this.disabled}));
  }

  onReachSelect(e: MatSelectChange) {
    this.selected.emit(e.value);

    if (!e.value) {
      this.parentForm.get(this.ref).setErrors(null);
    }
  }

  getError() {
    return this.parentForm.controls[this.ref].hasError('required') ? 'You must select a reach' :
            '';
  }

}
