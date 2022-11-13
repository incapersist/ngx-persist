import { Component, OnInit, Inject } from '@angular/core';
import { PerformanceStatistics } from 'src/app/pages/simulation/models/performance-statistics.model';
import { Index } from 'src/app/pages/simulation/models/indexer';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle/slide-toggle';
import { Router } from '@angular/router';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export class CompactStats {
  reachId: number;
  reachName: string;
  r2: number;
  n_s: number;
  rmse: number;
  re: number;
  log_n_s: number;
  old_r2: number;
  old_n_s: number;
  old_rmse: number;
  old_re: number;
  old_log_n_s: number;

  constructor(el: PerformanceStatistics[]) {
    this.reachId = +el[0].reachId;
    this.reachName = el[0].reachName;

    this.r2 = el[0].r2;
    this.n_s = el[0].n_s;
    this.rmse = el[0].rmse;
    this.re = el[0].re;
    this.log_n_s = el[0].log_n_s;

    if (el.length > 1) {
      this.old_r2 = el[1].r2;
      this.old_n_s = el[1].n_s;
      this.old_rmse = el[1].rmse;
      this.old_re = el[1].re;
      this.old_log_n_s = el[1].log_n_s;
    }
  }
}

@Component({
  selector: 'slu-performance-statistics-table',
  templateUrl: './performance-statistics-table.component.html',
  styleUrls: ['./performance-statistics-table.component.scss']
})
export class PerformanceStatisticsTableComponent implements OnInit {

  isFull = false;
  tempForm: FormGroup;
  reachId: number = null; // = 10;
  modelSetupId: number = null;
  showContents = true;

  tableData: PerformanceStatistics[] = null;
  compactTableData: CompactStats[] = null;
  fullColumns: string[] = ['date', 'r2', 'n_s', 'rmse', 're', 'log_n_s'];
  compactColumns: string[] = [
    'chartButton',
    'reach',
    'r2',
    'old_r2',
    'n_s',
    'old_n_s',
    'rmse',
    'old_rmse',
    're',
    'old_re',
    'log_n_s',
    'old_log_n_s'
  ];

  constructor(public snackBarRef: MatSnackBarRef<PerformanceStatisticsTableComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data: any,
              private router: Router) {
    this.modelSetupId = this.data.modelSetupId;
  }

  ngOnInit() {
    this.tempForm = new FormGroup({});
    this.buildTableData();
  }

  public onReachSelect(reach: Index) {
    this.reachId = +reach.id;
    this.buildTableData();
  }

  public onToggleChange(toggleEvent: MatSlideToggleChange) {
    this.isFull = toggleEvent.checked;
    this.buildTableData();
  }

  public getRePerf(stats: CompactStats): string {
    if (Math.abs(stats.re) < Math.abs(stats.old_re)) { return 'good'; }
    if (Math.abs(stats.re) > Math.abs(stats.old_re)) { return 'bad'; }
    return null;
  }

  public onChartButtonClick(e, element: CompactStats = null) {
    if (element) {
      this.router.navigate(['/pages/results'], { queryParams: { id: this.data.modelSetupId, reachId: element.reachId } });
    } else {
      this.router.navigate(['/pages/results'], { queryParams: { id: this.data.modelSetupId, reachId: this.reachId } });
    }
  }

  private buildTableData() {
    // https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-an-array-of-objects
    const groupedMap = this.data.performanceStatistics.reduce(
        (entryMap, e) => entryMap.set(e.reachId, [...entryMap.get(e.reachId) || [], e]),
        new Map()
    );

    if (this.isFull) {
      this.buildFullTable(groupedMap);
    } else {
      this.buildCompactTable(groupedMap);
    }
  }

  private buildFullTable(groupedMap) {
    if (this.reachId) {
      this.tableData = groupedMap.get(`${this.reachId}`);
    }
  }

  private buildCompactTable(groupedMap) {
    this.compactTableData = [];
    for (const [key, value] of groupedMap) {
      if (value.length > 1) {
        this.compactTableData.push(new CompactStats(value.slice(0, 2)));
      } else {
        this.compactTableData.push(new CompactStats(value));
      }
    }
  }
}
