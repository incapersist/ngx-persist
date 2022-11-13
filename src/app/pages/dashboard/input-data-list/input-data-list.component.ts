import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { InputFileService } from '../../import-data/input-file.service';
import { InputDataMeta } from './input-data-meta.model';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'slu-confirm-input-file-delete',
  templateUrl: 'dialog-confirm-input-file-delete.html',
})
export class DialogConfirmInputFileDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmInputFileDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-input-data-list',
  templateUrl: './input-data-list.component.html',
  styleUrls: ['./input-data-list.component.scss']
})
export class InputDataListComponent implements OnInit {

  @Input() fileTypeId: number = null;
  @Output() done = new EventEmitter<boolean>();

  inputs: InputDataMeta[];
  displayedColumns: string[] = ['delete', 'reference', 'filename', 'startDate', 'uploadDate', 'attribution'];

  constructor(private service: InputFileService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getInputMeta();
  }

  getInputMeta() {
    this.service
        .getInputFileMeta(this.fileTypeId)
        .subscribe(res => {
          this.inputs = res;
        });
  }

  onDeleteClick(event: MouseEvent, id: number) {
    if (event) {
      event.stopPropagation();
    }

    this.service
        .getInputFileDependencies(+id)
        .subscribe(res => {
          let dependencies = null;
          if (res && res.length > 0) {
            const total = +res[0].model_setup_count + +res[0].result_set_count;
            if (total > 0) {
              dependencies = res[0];
            }
          }
          this.openDialog(id, dependencies);
        });
  }

  openDialog(id: number, deps: any): void {
    const dialogRef = this.dialog.open(DialogConfirmInputFileDeleteComponent, {
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
        .deleteInputFile(id)
        .subscribe(res => {
          this.done.emit(true);
        });
  }

}
