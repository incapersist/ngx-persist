import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultsService } from '../../results.service';

@Component({
  selector: 'slu-results-charts-page',
  templateUrl: './results-charts-page.component.html',
  styleUrls: ['./results-charts-page.component.scss']
})
export class ResultsChartsPageComponent implements OnInit {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() typeId: number = null;
  @Input() parentForm: FormGroup;
  @Input() itemIds: number[] = null;
  @Input() reachId: number = null;
  @Input() soilId: number = null;

  reach: any;

  constructor(private resultsService: ResultsService) { }

  ngOnInit() {
    if (!this.itemIds || this.itemIds.length === 0) {
      this.getResultsMeta(this.typeId);
    }
  }

  getResultsMeta(typeId: number) {
    this.resultsService
        .getResultsItems(this.runId, typeId)
        .subscribe(res => {
          this.itemIds = res.map(x => +x.id);
        });
  }

  onIndexSelect(reach: any) {
    this.reach = reach;
  }
}
