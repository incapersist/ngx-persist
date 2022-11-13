import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ParameterService } from '../../parameters/parameter.service';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StreamNetwork } from '../../shared/models/stream-network.model';
import { StreamNetworkDownload } from '../../export-data/stream-network-download/stream-network-download';

@Component({
  selector: 'slu-confirm-reach-structure-delete',
  templateUrl: 'dialog-confirm-reach-structure-delete.html',
})
export class DialogConfirmReachStructureDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmReachStructureDeleteComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'slu-reach-structure-list',
  templateUrl: './reach-structure-list.component.html',
  styleUrls: ['./reach-structure-list.component.scss']
})
export class ReachStructureListComponent implements OnInit {

  @Output() done = new EventEmitter<boolean>();

  networks: StreamNetwork[];
  displayedColumns: string[] = ['delete', 'reference', 'parameterSet', 'inputFile', 'actionIcons'];

  constructor(private service: ParameterService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getStreamNetworkMeta();
  }

  getStreamNetworkMeta() {
    this.service
        .getStreamNetworkMeta()
        .subscribe(res => {
          this.networks = res;
        });
  }

  onDownloadClick(event: MouseEvent, streamNetwork: StreamNetwork) {
    if (event) {
      event.stopPropagation();
    }

    const psd = new StreamNetworkDownload(this.service);
    psd.download(+streamNetwork.id, streamNetwork.reference);
  }

  onDeleteClick(event: MouseEvent, id: number) {
    if (event) {
      event.stopPropagation();
    }

    this.service
        .getStreamNetworkDependencies(+id)
        .subscribe(res => {
          let dependencies = null;
          if (res && res.length > 0) {
            const total = +res[0].model_setup_count;
            if (total > 0) {
              dependencies = res[0];
            }
          }
          this.openDialog(id, dependencies);
        });
  }

  openDialog(id: number, deps: any): void {
    const dialogRef = this.dialog.open(DialogConfirmReachStructureDeleteComponent, {
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
        .deleteStreamNetwork(id)
        .subscribe(res => {
          this.done.emit(true);
        });
  }
}
