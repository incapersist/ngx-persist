import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResultsService } from '../../results/results.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ResultsSetMeta } from '../../results/results.model';
import { ResultsDownload } from '../../export-data/results-download/results-download';
import { SimulationService } from '../../simulation/simulation.service';

@Component({
  selector: 'slu-confirm-results-set-delete',
  templateUrl: 'dialog-confirm-results-set-delete.html',
})
export class DialogConfirmResultsSetDeleteComponent {

  constructor(public dialogRef: MatDialogRef<DialogConfirmResultsSetDeleteComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'slu-results-set-list',
  templateUrl: './results-set-list.component.html',
  styleUrls: ['./results-set-list.component.scss']
})
export class ResultsSetListComponent implements OnInit {

  @Output() done = new EventEmitter<boolean>();

  resultsSets: ResultsSetMeta[];
  displayedColumns: string[] = ['delete', 'reference', 'startDate', 'timesteps', 'level', 'actionIcons'];

  constructor(private service: ResultsService,
              private simulationService: SimulationService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getParameterSetMeta();
  }

  getParameterSetMeta() {
    this.service
        .getResultsMeta()
        .subscribe(res => {
          this.resultsSets = res;
        });
  }

  onDeleteClick(event: MouseEvent, id: number) {
    if (event) {
      event.stopPropagation();
    }

    this.openDialog(id);
  }

  onDownloadClick(event: MouseEvent, resultsSet: ResultsSetMeta) {
    if (event) {
      event.stopPropagation();
    }

    const rd = new ResultsDownload(this.service, this.simulationService);
    rd.download(+resultsSet.modelSetupId, resultsSet.reference);
  }

  openDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmResultsSetDeleteComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(isDeleteConfirmed => {
      if (isDeleteConfirmed) {
          this.delete(id);
      }
    });
  }

  delete(id: number) {
    this.service
        .deleteResultsSet(id)
        .subscribe(res => {
          this.done.emit(true);
        });
  }
}
