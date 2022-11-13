import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ParametersComponent, DialogParameterEditComponent } from './parameters.component';
import { ParametersRoutingModule } from './parameters-routing.module';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { ParameterDialogComponent } from './parameter-dialog/parameter-dialog.component';
import { ParameterDialogPageComponent } from './parameter-dialog/parameter-dialog-page/parameter-dialog-page.component';
import { ParameterDialogTableComponent } from './parameter-dialog/parameter-dialog-page/parameter-dialog-table/parameter-dialog-table.component';
import { ParameterEditComponent } from './parameter-dialog/parameter-dialog-page/parameter-edit/parameter-edit.component';
import { SimulationRunModule } from '../simulation/simulation-run/simulation-run.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { ParameterDialogDropdownComponent } from './parameter-dialog/parameter-dialog-dropdown/parameter-dialog-dropdown.component';
import { StreamNetworkUpdateComponent } from './stream-network-update/stream-network-update.component';

@NgModule({
  declarations: [
    ParametersComponent,
    ParameterEditComponent,
    ParameterDialogComponent,
    ParameterDialogPageComponent,
    ParameterDialogTableComponent,
    DialogParameterEditComponent,
    ParameterDialogDropdownComponent,
    StreamNetworkUpdateComponent,
  ],
  imports: [
    CommonModule,
    AppFormsModule,
    AppMaterialModule,
    MatExpansionModule,
    SharedModule,
    ParametersRoutingModule,
    SimulationRunModule,
  ],
  entryComponents: [
    DialogParameterEditComponent,
  ],
  exports: [
  ]
})
export class ParametersModule { }
