import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { SilentLoginGuard } from './guards/silent-login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [SilentLoginGuard],
  },
  { path: 'callback', component: CallbackComponent },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
//      {anchorScrolling: 'enabled'}
//      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
