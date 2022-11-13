
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExportDataComponent } from './export-data.component';

const routes: Routes = [
  { path: '', component: ExportDataComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportDataRoutingModule { }
