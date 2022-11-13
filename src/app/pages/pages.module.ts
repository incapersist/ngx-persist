import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { LayoutModule } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
// import { library } from '@fortawesome/fontawesome-svg-core';
import {
  fas,
  faTachometerAlt,
  faCloudUploadAlt,
  faCalculator,
  faSquareRootAlt,
  faChartBar,
  faProjectDiagram,
  faCloudDownloadAlt,
  faTools,
} from '@fortawesome/free-solid-svg-icons';
import { DashboardModule } from './dashboard/dashboard.module';
import { AppFormsModule } from './shared/modules/app-forms.module';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { AdminModule } from './admin/admin.module';
import { AppMaterialModule } from './shared/modules/app-material.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    PagesComponent,
    TitleBarComponent,
    SideNavComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AppFormsModule,
    HttpClientModule,
    AdminModule,
    DashboardModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    FontAwesomeModule,
    LayoutModule,
    AppFormsModule,
    AppMaterialModule,
  ],
  providers: [
  ],
  exports: [
    AppFormsModule,
  ]
})
export class PagesModule {
    constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas);

    library.addIcons(faTachometerAlt);
    library.addIcons(faCloudUploadAlt);
    library.addIcons(faCalculator);
    library.addIcons(faSquareRootAlt);
    library.addIcons(faChartBar);
    library.addIcons(faProjectDiagram);
    library.addIcons(faCloudDownloadAlt);
    library.addIcons(faTools);
  }
 }
