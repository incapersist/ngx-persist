import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputUploadComponent, DialogInputFileUploadedComponent, DialogPermissionComponent } from './input-upload/input-upload.component';
import { SharedModule } from '../shared/shared.module';
import { ImportDataComponent } from './import-data.component';
import { ParameterUploadComponent, DialogParameterFileUploadedComponent } from './parameter-upload/parameter-upload.component';
import { ImportDataRoutingModule } from './import-data-routing.module';
import { AppFormsModule } from '../shared/modules/app-forms.module';
import { AppMaterialModule } from '../shared/modules/app-material.module';
import { InputTypeSelectComponent } from './input-upload/input-type-select/input-type-select.component';
import { StructureUploadComponent, DialogStructureFileUploadedComponent } from './structure-upload/structure-upload.component';

@NgModule({
  declarations: [
    ImportDataComponent,
    InputUploadComponent,
    ParameterUploadComponent,
    DialogParameterFileUploadedComponent,
    DialogInputFileUploadedComponent,
    InputTypeSelectComponent,
    StructureUploadComponent,
    DialogStructureFileUploadedComponent,
    DialogPermissionComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    AppFormsModule,
    SharedModule,
    ImportDataRoutingModule,
  ],
  entryComponents: [
    DialogParameterFileUploadedComponent,
    DialogInputFileUploadedComponent,
    DialogStructureFileUploadedComponent,
    DialogPermissionComponent,
  ],
  exports: [
    InputUploadComponent,
    InputTypeSelectComponent,
  ]
})
export class ImportDataModule { }
