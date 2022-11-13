import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SimulationRunComponent } from './simulation-run.component';
import { SharedModule } from '../../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    SimulationRunComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ],
  exports: [
    SimulationRunComponent,
  ]
})
export class SimulationRunModule { }
