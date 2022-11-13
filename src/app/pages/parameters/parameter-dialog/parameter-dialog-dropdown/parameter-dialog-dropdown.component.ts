import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ParameterDialog } from '../../models/parameter-layout';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'slu-parameter-dialog-dropdown',
  templateUrl: './parameter-dialog-dropdown.component.html',
  styleUrls: ['./parameter-dialog-dropdown.component.scss'],
})
export class ParameterDialogDropdownComponent implements OnInit, OnChanges {

  @Input() parentForm: FormGroup;
  @Input() dialog: ParameterDialog;

  @Output() selected = new EventEmitter<string>();

  indexers: string[];

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dialog'].currentValue) {
      this.indexers = [];

      for (const page of this.dialog) {
        this.indexers.push(page.name);
      }
    }

    if (changes['parentForm'].currentValue) {
      this.formSetup();
    }
  }

  formSetup() {
    this.parentForm.removeControl('dialogDropdown');
    this.parentForm.addControl('dialogDropdown', new FormControl('', Validators.required));

    this.parentForm.controls.dialogDropdown.setValue(this.indexers[0]);
    this.selected.emit(this.indexers[0]);
  }

  onIndexSelect(e: MatSelectChange) {
    this.selected.emit(e.value);
  }

  getError() {
    return this.parentForm.controls.dialogDropdown.hasError('required')
            ? 'You must select an index'
            : '';
  }
}
