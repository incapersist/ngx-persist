import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParameterDialogPage } from '../../../models/parameter-layout';

@Component({
  selector: 'slu-parameter-dialog-table',
  templateUrl: './parameter-dialog-table.component.html',
  styleUrls: ['./parameter-dialog-table.component.scss']
})
export class ParameterDialogTableComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() page: ParameterDialogPage;

  constructor() { }

  ngOnInit() {
  }

}
