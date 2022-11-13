import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ParameterService } from '../../parameters/parameter.service';
import { ParameterSetMeta } from '../../parameters/models/parameter-set';
import { ParameterSetDownload } from '../../export-data/parameter-set-download/parameter-set-download';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'slu-confirm-parameter-set-delete',
  templateUrl: 'dialog-confirm-parameter-set-delete.html',
})
export class DialogConfirmParameterSetDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmParameterSetDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.scss']
})
export class ParameterListComponent implements OnInit {

  @Output() done = new EventEmitter<boolean>();

  parameterSets: ParameterSetMeta[];
  displayedColumns: string[] = ['delete', 'reference', 'startDate', 'timesteps', 'modelVersion', 'lastEditDate', 'actionIcons'];

  constructor(private service: ParameterService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getParameterSetMeta();
  }

  getParameterSetMeta(force: boolean = false) {
    this.service
        .getParameterSetMeta(null, force)
        .subscribe(res => this.parameterSets = res);
  }

  onDownloadClick(event: MouseEvent, parameterSetMeta: ParameterSetMeta) {
    if (event) {
      event.stopPropagation();
    }

    const psd = new ParameterSetDownload(this.service);
    psd.download(+parameterSetMeta.id, parameterSetMeta.reference);
  }

  onDeleteClick(event: MouseEvent, id: number) {
    if (event) {
      event.stopPropagation();
    }

    this.service
        .getParameterSetDependencies(+id)
        .subscribe(res => {
          let dependencies = null;
          if (res && res.length > 0) {
            const total = +res[0].model_setup_count + +res[0].result_set_count + +res[0].stream_network_count;
            if (total > 0) {
              dependencies = res[0];
            }
          }
          this.openDialog(id, dependencies);
        });
  }

  openDialog(id: number, deps: any): void {
    const dialogRef = this.dialog.open(DialogConfirmParameterSetDeleteComponent, {
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
        .deleteParameterSet(id)
        .subscribe(res => {
          this.getParameterSetMeta(true);
          this.done.emit(true);
        });
  }
}
