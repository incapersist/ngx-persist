import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../simulation/simulation.service';
import { ResultsService } from '../../results/results.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModelSetupMeta } from '../../simulation/models/model-setup.model';

@Component({
  selector: 'slu-inca-data-download',
  templateUrl: './inca-data-download.component.html',
  styleUrls: ['./inca-data-download.component.scss']
})
export class IncaDataDownloadComponent implements OnInit {

  incaForm: FormGroup;
  run: ModelSetupMeta = null;
  availableResultsCount: number;
  isRunCountRetrieved = false;
  isAvailable = false;
  isFetching = false;
  message = 'This may take a while, please be patient...';

  constructor(private service: SimulationService,
              private resultsService: ResultsService) { }

  ngOnInit() {
    this.incaForm = new FormGroup({
      'baselineSmd': new FormControl(
        null,
        Validators.compose([
          Validators.required,
        ]),
      ),
    });
  }

  getBaselineError() {
    return (
      this.incaForm.controls.baselineSmd.hasError('required') ? 'You must enter a baseline SMD' :
      ''
    );
  }

  onRunSelect(modelRun: ModelSetupMeta) {
    this.isAvailable = false;
    this.run = modelRun;
    this.checkAvailableResultLevel();
  }

  onRunCountChange(count: number) {
    this.availableResultsCount = count;
    this.isRunCountRetrieved = true;
  }

  checkAvailableResultLevel() {
    this.service
        .getResultLevelAvailability(+this.run.id, 3)
        .subscribe(res => this.isAvailable = (+res[0]['isAvailable'] === 1));
  }

  onSubmit() {
    this.isFetching = true;
    this.getIncaData();
  }

  getIncaData() {
    const baselineSmd = this.incaForm.controls.baselineSmd.value;
    this.resultsService
        .getIncaData(+this.run.id, baselineSmd)
        .subscribe(res => {
          this.isFetching = false;
          for (const reach of res) {
            const filename = `${this.run.reference} - ${reach['reach']}.dat`;
            this.download(reach, filename);
          }
        });
  }

  download(reach: any, filename: string) {
    let fileContents = '';

      for (const row of reach['results']) {
        fileContents += `${row['smd']}\t${row['her']}\t${row['temp']}\t${row['precip']}\r\n`;
      }

    // https://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
    const blob = new Blob([fileContents], {
        type: 'text/plain;charset=utf-8;',
    });
    saveAs(blob, filename);
  }
}
