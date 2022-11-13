import { Component, OnInit } from '@angular/core';
import { ExportDataService } from '../export-data.service';
import { saveAs } from 'file-saver';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'slu-input-data-download',
  templateUrl: './input-data-download.component.html',
  styleUrls: ['./input-data-download.component.scss']
})
export class InputDataDownloadComponent implements OnInit {

  inputDownloadForm: FormGroup;

  constructor(private service: ExportDataService) { }

  ngOnInit() {
    this.inputDownloadForm = new FormGroup({});
  }

  onInputDataSelect(inputData: any) {
    this.service
      .getInputData(+inputData.id)
      .subscribe(res => {
        this.download(res, inputData['original_filename']);
      });
  }

  download(inputs: any, filename: string) {
    let fileContents = '';

    // Number of timesteps
    const timesteps = inputs['reachData'][0]['columns']['precipitation'].length;
    fileContents += `${timesteps}\r\n`;
    // Number of reaches
    fileContents += `${inputs['reachCount']}\r\n`;

    for (const reach of inputs['reachData']) {
      // Reach ID
      fileContents += `${reach['reachId']}\r\n`;

      for (let i = 0; i < timesteps; i++) {
        fileContents += `${reach['columns']['precipitation'][i]}\t${reach['columns']['temperature'][i]}\r\n`;
      }
    }

    // https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
    const blob = new Blob([fileContents], {
        type: 'text/plain;charset=utf-8;',
    });
    saveAs(blob, filename);
  }
}
