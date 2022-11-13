import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultsService } from '../../results.service';

@Component({
  selector: 'slu-percolation-results-charts-page',
  templateUrl: './percolation-results-charts-page.component.html',
  styleUrls: ['./percolation-results-charts-page.component.scss']
})
export class PercolationResultsChartsPageComponent implements OnInit {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() typeId: number = null;
  @Input() parentForm: FormGroup;
  @Input() reachId: number = null;
  @Input() soilId: number = null;
  @Input() itemIds: number = null;

  reach: any;
  soilsBelow: number[];

  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    this.getSoilsBelow();
  }

  getSoilsBelow() {
    this.resultsService
        .getSoilsBelow(this.runId, this.soilId)
        .subscribe(res => {
          this.soilsBelow = Object.values(res);
        });
  }

  onIndexSelect(reach: any) {
    this.reach = reach;
  }
}
