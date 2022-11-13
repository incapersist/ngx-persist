import { Component, OnInit, Input, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { ResultsService } from '../../../../results.service';
import { PerformanceStatistics } from 'src/app/pages/simulation/models/performance-statistics.model';

@Component({
  selector: 'slu-chart-performance-statistics',
  templateUrl: './chart-performance-statistics.component.html',
  styleUrls: ['./chart-performance-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartPerformanceStatisticsComponent implements OnInit, OnChanges {

  @Input() runId: number;
  @Input() itemId: number;
  @Input() reachId: number;

  stats: PerformanceStatistics;

  constructor(private service: ResultsService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getStatistics();
  }

  getStatistics() {
    if (this.runId && this.itemId && this.reachId) {
      this.service
          .getPerformanceStatistics(this.runId, false, this.itemId, this.reachId)
          .subscribe(res => {
            this.stats = res.length ? res[0] : null;
          });
    }
  }
}
