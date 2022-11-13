import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ParameterListComponent, DialogConfirmParameterSetDeleteComponent } from './parameter-list/parameter-list.component';
import { MatTableModule } from '@angular/material/table';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { ModelSetupListComponent, DialogConfirmModelSetupDeleteComponent } from './model-setup-list/model-setup-list.component';
import { ResultsSetListComponent, DialogConfirmResultsSetDeleteComponent } from './results-set-list/results-set-list.component';
import { InputDataListComponent, DialogConfirmInputFileDeleteComponent } from './input-data-list/input-data-list.component';
import { ReachStructureListComponent, DialogConfirmReachStructureDeleteComponent } from './reach-structure-list/reach-structure-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ParameterListComponent,
    DialogConfirmParameterSetDeleteComponent,
    DialogConfirmModelSetupDeleteComponent,
    DialogConfirmResultsSetDeleteComponent,
    DialogConfirmInputFileDeleteComponent,
    DialogConfirmReachStructureDeleteComponent,
    ModelSetupListComponent,
    ResultsSetListComponent,
    InputDataListComponent,
    ReachStructureListComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppFormsModule,
    DashboardRoutingModule,
    MatTableModule,
    SharedModule,
  ],
  entryComponents: [
    DialogConfirmParameterSetDeleteComponent,
    DialogConfirmModelSetupDeleteComponent,
    DialogConfirmResultsSetDeleteComponent,
    DialogConfirmInputFileDeleteComponent,
    DialogConfirmReachStructureDeleteComponent,
  ],
  exports: [
    DashboardComponent,
  ]
})
export class DashboardModule { }
