import { SimulationService } from '../../simulation/simulation.service';
import { ResultsService } from '../../results/results.service';
import { saveAs } from 'file-saver';

export class ResultsDownload {

    constructor(private resultsService: ResultsService,
                private simulationService: SimulationService) {}

  download(id: number, reference: string) {
      this.getResultsLevel(id, reference);
  }

  getResultsLevel(id: number, reference: string) {
    this.simulationService
        .getResultLevelAvailability(id)
        .subscribe(level => {
          this.downloadResults(id, reference, +level[0]['level']);
        });
  }

  downloadResults(id: number, reference: string, maxLevel: number) {
    this.downloadReachResults(id, reference);

    if (maxLevel > 0 && maxLevel < 3) {
      this.downloadSoilResults(id, reference, 3);
    }

    if (maxLevel > 1) {
      this.downloadLandResults(id, reference);
    }

    if (maxLevel > 2) {
      this.downloadSoilResults(id, reference, 4);
    }
  }

  downloadReachResults(id: number, reference: string) {
    this.resultsService
        .downloadResults(1, id)
        .subscribe(res => {
          const filename = `${reference}_streamflow.csv`;
          this.saveResults(res, filename);
        });
  }

  saveResults(results: any, filename: string) {
    let fileContents = '';

    for (const reach of results) {
      // Reach ID
      fileContents += `${reach['reference']}\r\n`;

      for (const item of Object.entries(reach['results'][0])) {
        fileContents += `${item[0]},`;
      }
      fileContents += `\r\n`;

      for (const row of reach['results']) {
        for (const item of Object.entries(row)) {
          fileContents += `${item[1]},`;
        }
        fileContents += `\r\n`;
      }

      fileContents += `\r\n`;
    }

    const blob = new Blob([fileContents], {
        type: 'text/plain;charset=utf-8;',
    });
    saveAs(blob, filename);
  }

  downloadLandResults(id: number, reference: string) {
    this.simulationService
        .getIndexes(id, 2)
        .subscribe(landIndexes => {
          for (const land of landIndexes) {
            this.resultsService
                .downloadResults(2, id, +land['id'])
                .subscribe(res => {
                  const filename = `${reference}_${res[0]['reference']}.csv`;
                  this.saveResults(res[0]['results'], filename);
                });
          }
        });
  }

  downloadSoilResults(id: number, reference: string, resultsTypeId: number) {
    this.simulationService
        .getIndexes(id, 3)
        .subscribe(soilIndexes => {
          for (const soil of soilIndexes) {
            this.simulationService
                .getIndexes(id, 2)
                .subscribe(landIndexes => {
                  for (const land of landIndexes) {
                    this.resultsService
                        .downloadResults(resultsTypeId, id, +land['id'], +soil['id'])
                        .subscribe(res => {
                          const filename = `${reference}_${res[0]['reference']}_${res[0]['results'][0]['reference']}.csv`;
                          this.saveResults(res[0]['results'][0]['results'], filename);
                        });
                  }
                });
          }
        });
  }
}
