import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AccessRequestsComponent, DialogRequestCompleteComponent } from './components/access-requests/access-requests.component';
import { MatTableModule } from '@angular/material/table';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { GuiLayoutUploadComponent } from './components/gui-layout-upload/gui-layout-upload.component';
import { SharedModule } from '../shared/shared.module';
import {
  NewUserDefaultDataComponent,
  DialogDefaultDataChangesSavedComponent
} from './components/new-user-default-data/new-user-default-data.component';

@NgModule({
  declarations: [
    AdminComponent,
    AccessRequestsComponent,
    GuiLayoutUploadComponent,
    NewUserDefaultDataComponent,
    DialogDefaultDataChangesSavedComponent,
    DialogRequestCompleteComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppFormsModule,
    AdminRoutingModule,
    MatTableModule,
    SharedModule
  ],
  entryComponents: [
    DialogDefaultDataChangesSavedComponent,
    DialogRequestCompleteComponent,
  ],
  exports: [
    AdminComponent,
  ]
})
export class AdminModule { }
