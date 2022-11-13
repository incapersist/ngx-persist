import { Component, OnInit } from '@angular/core';
import { NewUserDefaultDataService } from './new-user-default-data.service';
import { ModelSetupMeta } from '../../../simulation/models/model-setup.model';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'slu-dialog-default-data-changes-saved',
  templateUrl: 'dialog-default-data-changes-saved.html',
})
export class DialogDefaultDataChangesSavedComponent {

  constructor(public dialogRef: MatDialogRef<DialogDefaultDataChangesSavedComponent>) {}
}

@Component({
  selector: 'slu-new-user-default-data',
  templateUrl: './new-user-default-data.component.html',
  styleUrls: ['./new-user-default-data.component.scss']
})
export class NewUserDefaultDataComponent implements OnInit {

  displayedColumns: string[] = ['reference', 'startDate', 'timesteps', 'default'];
  originalSetups: ModelSetupMeta[];
  modelSetups: ModelSetupMeta[];
  isUploading = false;

  constructor(private service: NewUserDefaultDataService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getCurrentDataList();
  }

  getCurrentDataList() {
    this.service
        .getCurrent()
        .subscribe(res => {
          // Map the MySQL tinyint '1' or '0' value to boolean 'true' or 'false', respectively
          res.forEach(obj => +obj.is_default_for_new_user === 1 ? obj.is_default_for_new_user = true : obj.is_default_for_new_user = false);
          this.originalSetups = res.map(obj => ({...obj}));
          this.modelSetups = this.originalSetups.map(obj => ({...obj}));
      });
  }

  hasChanged(): boolean {
    return (JSON.stringify(this.modelSetups) !== JSON.stringify(this.originalSetups));
  }

  onSubmit() {
    this.isUploading = true;

    // Create an array that includes only model setups that have changed
    const changed: ModelSetupMeta[] = [];
    for (const current of this.modelSetups) {
      const found = this.originalSetups.find(obj => +obj.id === +current.id);
      if (found && found.is_default_for_new_user !== current.is_default_for_new_user) {
        changed.push(current);
      }
    }

    this.service
        .putDefaultModelSetups(changed)
        .subscribe(
          res => {
            this.openDialog();
          },
          err => true,
          () => this.isUploading = false
        );
  }

  openDialog(wasImported: boolean = true): void {
    const dialogRef = this.dialog.open(DialogDefaultDataChangesSavedComponent, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.originalSetups = this.modelSetups.map(obj => ({...obj}));
    });
  }
}
