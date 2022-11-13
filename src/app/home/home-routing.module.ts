import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingPageComponent },
      { path: 'signup', component: SignupComponent },
    ]
  }
];

/*
const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
      { path: 'landing', component: LandingPageComponent },
      { path: 'signup', component: SignupComponent },
];
*/

@NgModule({
  imports: [
    RouterModule.forChild(
      routes,
    )
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule { }
