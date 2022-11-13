import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../guards/auth.guard';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard],
        data: { roles: ['Administrator'] }
      },
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'import', loadChildren: () => import('./import-data/import-data.module').then(m => m.ImportDataModule) },
      { path: 'parameters', loadChildren: () => import('./parameters/parameters.module').then(m => m.ParametersModule) },
      { path: 'model-run', loadChildren: () => import('./simulation/simulation.module').then(m => m.SimulationModule) },
      { path: 'results', loadChildren: () => import('./results/results.module').then(m => m.ResultsModule) },
      { path: 'export', loadChildren: () => import('./export-data/export-data.module').then(m => m.ExportDataModule) },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      routes,
    )
  ],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
