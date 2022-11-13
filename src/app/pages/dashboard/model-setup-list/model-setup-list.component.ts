import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { SimulationService } from '../../simulation/simulation.service';
import { ModelSetupMeta } from '../../simulation/models/model-setup.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'slu-confirm-model-setup-delete',
  templateUrl: 'dialog-confirm-model-setup-delete.html',
})
export class DialogConfirmModelSetupDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmModelSetupDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-model-setup-list',
  templateUrl: './model-setup-list.component.html',
  styleUrls: ['./model-setup-list.component.scss']
})
export class ModelSetupListComponent implements OnInit {

  @Output() done = new EventEmitter<boolean>();

  modelSetups: ModelSetupMeta[];
  displayedColumns: string[] = ['delete', 'reference', 'startDate', 'timesteps', 'actionIcons'];

  constructor(private service: SimulationService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getParameterSetMeta();
  }

  getParameterSetMeta() {
    this.service
        .getModelSetups()
        .subscribe(res => {
          this.modelSetups = res;
        });
  }

  onDeleteClick(event: MouseEvent, id: number) {
    if (event) {
      event.stopPropagation();
    }

    this.service
        .getModelSetupDependencies(+id)
        .subscribe(res => {
          let dependencies = null;
          if (res && res.length > 0) {
            if (+res[0].result_set_count > 0) {
              dependencies = res[0];
            }
          }
          this.openDialog(id, dependencies);
        });
  }

  openDialog(id: number, deps: any): void {
    const dialogRef = this.dialog.open(DialogConfirmModelSetupDeleteComponent, {
      width: '350px',
      data: {dependencies: deps}
    });

    dialogRef.afterClosed().subscribe(isDeleteConfirmed => {
      if (isDeleteConfirmed) {
          this.delete(id);
      }
    });
  }

  delete(id: number) {
    this.service
        .deleteModelSetup(id)
        .subscribe(res => {
          this.done.emit(true);
        });
  }
}
