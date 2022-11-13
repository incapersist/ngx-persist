import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParameterDialogPage, ParameterDialog, ParameterDialogTable, ParameterDialogPageContents } from '../../models/parameter-layout';
import { ParameterItem, Parameter } from '../../models/parameter-set';

@Component({
  selector: 'slu-parameter-dialog-page',
  templateUrl: './parameter-dialog-page.component.html',
  styleUrls: ['./parameter-dialog-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParameterDialogPageComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() page: ParameterDialogPage;

  constructor() { }

  ngOnInit() {
  }

  checkInstanceOf(content: ParameterItem): string {
    if (content instanceof Parameter) { return 'Parameter'; }
    if (content instanceof ParameterDialog) { return 'ParameterDialog'; }
    if (content instanceof ParameterDialogTable) { return 'ParameterDialogTable'; }
    if (content instanceof ParameterDialogPageContents) { return 'ParameterDialogPageContents'; }
  }
}
