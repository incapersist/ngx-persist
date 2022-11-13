import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ParameterSetSelectComponent } from './components/dropdowns/parameter-set-select/parameter-set-select.component';
import { SimulationRunSelectComponent } from './components/dropdowns/simulation-run-select/simulation-run-select.component';
import { InputDataSelectComponent } from './components/dropdowns/input-data-select/input-data-select.component';
import { IndexSelectComponent } from './components/dropdowns/index-select/index-select.component';
import { AppFormsModule } from './modules/app-forms.module';
import { OutputSizeSelectComponent } from './components/dropdowns/output-size-select/output-size-select.component';
import { ModelVersionSelectComponent } from './components/dropdowns/model-version-select/model-version-select.component';
import { PerformanceStatisticsComponent } from './components/performance-statistics/performance-statistics.component';
import { PerformanceStatisticsTableComponent } from './components/performance-statistics/performance-statistics-table/performance-statistics-table.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { StreamNetworkSelectComponent } from './components/dropdowns/stream-network-select/stream-network-select.component';
import { StreamNetworkGraphComponent, DialogConfirmUpstreamNodeDeleteComponent } from './components/stream-network-editor/stream-network-graph/stream-network-graph.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { StreamNetworkEditorComponent } from './components/stream-network-editor/stream-network-editor.component';
import { ReachNodeSelectComponent } from './components/stream-network-editor/stream-network-graph/reach-node-select/reach-node-select.component';
import { AddReachNodeComponent } from './components/stream-network-editor/stream-network-graph/add-reach-node/add-reach-node.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SigFigPipe } from './pipes/sig-fig.pipe';

@NgModule({
  declarations: [
    FileUploadComponent,
    ParameterSetSelectComponent,
    SimulationRunSelectComponent,
    OutputSizeSelectComponent,
    InputDataSelectComponent,
    IndexSelectComponent,
    ModelVersionSelectComponent,
    PerformanceStatisticsComponent,
    PerformanceStatisticsTableComponent,
    StreamNetworkSelectComponent,
    StreamNetworkGraphComponent,
    StreamNetworkEditorComponent,
    ReachNodeSelectComponent,
    AddReachNodeComponent,
    DialogConfirmUpstreamNodeDeleteComponent,
    SigFigPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AppFormsModule,
    MatBottomSheetModule,
    MatTableModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxGraphModule,
  ],
  exports: [
    RouterModule,
    FileUploadComponent,
    ParameterSetSelectComponent,
    SimulationRunSelectComponent,
    OutputSizeSelectComponent,
    InputDataSelectComponent,
    StreamNetworkSelectComponent,
    IndexSelectComponent,
    ModelVersionSelectComponent,
    PerformanceStatisticsComponent,
    PerformanceStatisticsTableComponent,
    StreamNetworkGraphComponent,
    StreamNetworkEditorComponent,
    NgxGraphModule,
  ],
  entryComponents: [
    PerformanceStatisticsTableComponent,
    DialogConfirmUpstreamNodeDeleteComponent,
  ],
  providers: [DecimalPipe],
})
export class SharedModule { }
