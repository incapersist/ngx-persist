import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimulationRunModule } from './simulation-run/simulation-run.module';
import { SimulationRunComponent } from './simulation-run/simulation-run.component';
import { SimulationComponent } from './simulation.component';
import { SharedModule } from '../shared/shared.module';
import { CreateNewComponent, DialogNewSetupCreatedComponent, DialogGenerateParameterSetComponent } from './create-new/create-new.component';
import { UseExistingComponent } from './use-existing/use-existing.component';
import { SimulationRoutingModule } from './simulation-routing.module';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatStepperModule } from '@angular/material/stepper';
import { GenerateParameterSetComponent } from './generate-parameter-set/generate-parameter-set.component';
import { IndexListControlComponent } from './generate-parameter-set/index-list-control/index-list-control.component';

@NgModule({
  declarations: [
    SimulationComponent,
    CreateNewComponent,
    UseExistingComponent,
    DialogNewSetupCreatedComponent,
    DialogGenerateParameterSetComponent,
    GenerateParameterSetComponent,
    IndexListControlComponent,
  ],
  imports: [
    CommonModule,
    AppFormsModule,
    AppMaterialModule,
    MatExpansionModule,
    MatStepperModule,
    SimulationRoutingModule,
    SimulationRunModule,
    SharedModule,
  ],
  entryComponents: [
    DialogNewSetupCreatedComponent,
    DialogGenerateParameterSetComponent,
  ],
  exports: [
    SimulationComponent,
    SimulationRunComponent,
  ]
})
export class SimulationModule { }
