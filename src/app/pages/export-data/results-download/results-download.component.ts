import { Component, OnInit } from '@angular/core';
import { SimulationService } from '../../simulation/simulation.service';
import { ResultsService } from '../../results/results.service';
import { ModelSetupMeta } from '../../simulation/models/model-setup.model';
import { ResultsDownload } from './results-download';

@Component({
  selector: 'slu-results-download',
  templateUrl: './results-download.component.html',
  styleUrls: ['./results-download.component.scss']
})
export class ResultsDownloadComponent implements OnInit {

  modelSetup: ModelSetupMeta = null;
  availableResultsCount: number;
  isRunCountRetrieved = false;
  isAvailable = false;

  constructor(private resultsService: ResultsService,
              private simulationService: SimulationService) { }

  ngOnInit() {
  }

  onRunSelect(modelSetup: ModelSetupMeta) {
    this.isAvailable = false;
    this.modelSetup = modelSetup;

    const rd = new ResultsDownload(this.resultsService, this.simulationService);

    rd.download(+modelSetup.id, modelSetup.reference);
  }

  onRunCountChange(count: number) {
    this.availableResultsCount = count;
    this.isRunCountRetrieved = true;
  }
}
