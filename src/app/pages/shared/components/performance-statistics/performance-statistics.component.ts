import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ResultsService } from 'src/app/pages/results/results.service';
import { PerformanceStatisticsTableComponent } from './performance-statistics-table/performance-statistics-table.component';
import { PerformanceStatistics } from 'src/app/pages/simulation/models/performance-statistics.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SimulationService } from 'src/app/pages/simulation/simulation.service';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'slu-performance-statistics',
  templateUrl: './performance-statistics.component.html',
  styleUrls: ['./performance-statistics.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PerformanceStatisticsComponent implements OnInit, OnDestroy {

  @Input() modelSetupId: number = null;
  @Output() closed = new EventEmitter();

  private runCompleteSub: Subscription;

  constructor(private resultsService: ResultsService,
              private simulationService: SimulationService,
              private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getStatistics();
    this.runCompleteSub = this.simulationService
                              .runCompleteSubject
                              .subscribe(runId => {
                                if (+runId === this.modelSetupId) {
                                  this.getStatistics();
                                }
                              });
  }

  ngOnDestroy() {
    this.runCompleteSub.unsubscribe();
  }

  private getStatistics(): void {
    this.resultsService
        .getPerformanceStatistics(this.modelSetupId, true, 14)
        .subscribe(stats => {
          if (stats.length > 0) {
            this.openSnackBar(stats);
          }
        });
  }

  openSnackBar(stats: PerformanceStatistics[]): void {
    this._snackBar.openFromComponent(PerformanceStatisticsTableComponent, {
      data: {
        performanceStatistics: stats,
        modelSetupId: this.modelSetupId
      },
      panelClass: ['white-snackbar']
    });
  }
}
