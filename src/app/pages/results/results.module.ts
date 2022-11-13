import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsComponent } from './results.component';
import { SharedModule } from '../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ResultsRoutingModule } from './results-routing.module';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { ChartPerformanceStatisticsComponent } from './results-charts/results-charts-page/simple-chart/chart-performance-statistics/chart-performance-statistics.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ResultsChartsComponent } from './results-charts/results-charts.component';
import { ResultsChartsPageComponent } from './results-charts/results-charts-page/results-charts-page.component';
import { ReachChartsComponent } from './results-charts/reach-charts/reach-charts.component';
import { LandChartsComponent } from './results-charts/land-charts/land-charts.component';
import { SoilChartsComponent } from './results-charts/soil-charts/soil-charts.component';
import { SoilLandChartsComponent } from './results-charts/soil-charts/soil-land-charts/soil-land-charts.component';
import { SimpleDygraphsChartComponent } from './results-charts/results-charts-page/simple-dygraphs-chart/simple-dygraphs-chart.component';
import { NgDygraphsModule } from 'ng-dygraphs';
import { PercolationResultsChartsPageComponent } from './results-charts/percolation-results-charts-page/percolation-results-charts-page.component';

@NgModule({
  declarations: [
    ResultsComponent,
    ChartPerformanceStatisticsComponent,
    ResultsChartsComponent,
    ResultsChartsPageComponent,
    ReachChartsComponent,
    LandChartsComponent,
    SoilChartsComponent,
    SoilLandChartsComponent,
    SimpleDygraphsChartComponent,
    PercolationResultsChartsPageComponent,
  ],
  imports: [
    CommonModule,
    AppFormsModule,
    AppMaterialModule,
    SharedModule,
    ResultsRoutingModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgDygraphsModule,
  ],
  exports: [
  ]
})
export class ResultsModule { }
