import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SignupComponent, DialogSignupComponent, DialogTermsAndConditionsComponent } from './components/signup/signup.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { DialogLoginDeniedComponent } from '../services/auth.service';
import { CountrySelectComponent } from './components/signup/country-select/country-select.component';
import { PrimaryRoleSelectComponent } from './components/signup/primary-role-select/primary-role-select.component';

@NgModule({
  declarations: [
    HomeComponent,
    LandingPageComponent,
    SignupComponent,
    DialogSignupComponent,
    DialogLoginDeniedComponent,
    DialogTermsAndConditionsComponent,
    CountrySelectComponent,
    PrimaryRoleSelectComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPasswordStrengthModule.forRoot(),
  ],
  entryComponents: [
    DialogSignupComponent,
    DialogLoginDeniedComponent,
    DialogTermsAndConditionsComponent,
  ],
  providers: [
  ],
  exports: [
  ]
})
export class HomeModule {
    constructor() {}
 }
