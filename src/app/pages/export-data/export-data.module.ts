import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParameterSetDownloadComponent } from './parameter-set-download/parameter-set-download.component';
import { ExportDataComponent } from './export-data.component';
import { SharedModule } from '../shared/shared.module';
import { InputDataDownloadComponent } from './input-data-download/input-data-download.component';
import { ExportDataRoutingModule } from './export-data-routing.module';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { IncaDataDownloadComponent } from './inca-data-download/inca-data-download.component';
import { ResultsDownloadComponent } from './results-download/results-download.component';
import { StreamNetworkDownloadComponent } from './stream-network-download/stream-network-download.component';

@NgModule({
  declarations: [
    ExportDataComponent,
    ParameterSetDownloadComponent,
    InputDataDownloadComponent,
    IncaDataDownloadComponent,
    ResultsDownloadComponent,
    StreamNetworkDownloadComponent,
  ],
  imports: [
    CommonModule,
    AppFormsModule,
    AppMaterialModule,
    SharedModule,
    ExportDataRoutingModule,
  ],
})
export class ExportDataModule { }
