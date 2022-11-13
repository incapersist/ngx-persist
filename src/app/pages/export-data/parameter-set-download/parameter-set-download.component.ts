import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParameterService } from '../../parameters/parameter.service';
import { ParameterSetDownload } from './parameter-set-download';

@Component({
  selector: 'slu-parameter-set-download',
  templateUrl: './parameter-set-download.component.html',
  styleUrls: ['./parameter-set-download.component.scss']
})
export class ParameterSetDownloadComponent implements OnInit {

  parameterDownloadForm: FormGroup;

  constructor(private service: ParameterService) { }

  ngOnInit() {
    this.parameterDownloadForm = new FormGroup({});
  }

  onParameterSetSelect(parameterSet: any) {
    const psd = new ParameterSetDownload(this.service);
    psd.download(+parameterSet.id, parameterSet.reference);
  }
}
