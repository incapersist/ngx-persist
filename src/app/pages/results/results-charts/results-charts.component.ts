import { Component, OnInit, Input, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultsService } from '../results.service';
import { SimulationService } from '../../simulation/simulation.service';
import { ResultsItemMeta } from '../results.model';

@Component({
  selector: 'slu-results-charts',
  templateUrl: './results-charts.component.html',
  styleUrls: ['./results-charts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ResultsChartsComponent implements OnInit, OnChanges {

  @Input() runId: number = null;
  @Input() reachId: number = null;
  @Input() parentForm: FormGroup;

  selectedReachId: number = null;
  typeIds: number[];
  level: number;
  startDate: string;
  resultsItemMeta: ResultsItemMeta[];

  constructor(private resultsService: ResultsService,
              private simulationService: SimulationService) { }

  ngOnInit() {
 //   this.getChartLayout();
    this.getResultsMeta();
    this.getResultsItemsMeta();
    this.getResultsLevel();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['runId']) {
      this.reachId = null;
    }
  }

  getChartLayout() {
    this.resultsService
        .getLayout(this.runId)
        .subscribe(res => {
          const layout = JSON.parse(res[0]['layout']);
        });
  }

  getResultsItemsMeta() {
    this.resultsService
        .getResultsItemsMeta(this.runId)
        .subscribe(res => {
          this.resultsItemMeta = [...res];
        });
  }

  getResultsMeta() {
    this.resultsService
        .getResultsStartDate(this.runId)
        .subscribe(res => {
          this.startDate = res[0].startDate;
        });
  }

  getResultsLevel() {
    this.simulationService
        .getResultLevelAvailability(this.runId)
        .subscribe(res => {
          this.level = +res[0]['level'];
        });
  }

  onIndexSelect(reach: any) {
    this.selectedReachId = +reach.id;
  }
}
