import { Component, OnInit, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParameterDialog, ParameterDialogPage } from '../models/parameter-layout';

@Component({
  selector: 'slu-parameter-dialog',
  templateUrl: './parameter-dialog.component.html',
  styleUrls: ['./parameter-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ParameterDialogComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() dialog: ParameterDialog;

  isTable = false;
  currentPage: ParameterDialogPage = null;

  constructor() {
  }

  ngOnInit() {
    this.checkType();
  }

  checkType() {
    if (this.dialog) {
      if (this.dialog.type === 'Table') { this.isTable = true; }
    }
  }

  onDropdownSelect(indexer: string) {
    for (const page of this.dialog) {
      if (page.name === indexer) {
        this.currentPage = page;
      }
    }
  }
}
