import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
  ],
  imports: [
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
  ],
  exports: [
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
  ]
})
export class AppMaterialModule { }
