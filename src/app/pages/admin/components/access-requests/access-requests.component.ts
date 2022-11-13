import { Component, OnInit } from '@angular/core';
import { AccessRequestsService } from './access-requests.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'slu-dialog-request-complete-saved',
  templateUrl: 'dialog-request-complete.html',
})
export class DialogRequestCompleteComponent {
  constructor(public dialogRef: MatDialogRef<DialogRequestCompleteComponent>) {}
}

@Component({
  selector: 'slu-access-requests',
  templateUrl: './access-requests.component.html',
  styleUrls: ['./access-requests.component.scss']
})
export class AccessRequestsComponent implements OnInit {

  isUploading = false;
  pendingRequests: any[];
  displayedColumns: string[] = ['email', 'name', 'role', 'country', 'reason', 'deny', 'approve'];

  constructor(private service: AccessRequestsService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getPendingRequests();
  }

  getPendingRequests() {
    this.service
        .getPending()
        .subscribe(pendingRequests => {
          this.pendingRequests = JSON.parse(pendingRequests);
        });
  }

  onApproveClick(e: MouseEvent, user: any) {
    this.isUploading = true;
    this.snackBar.open('This make take a moment, please be patient', '', {duration: 5000});

    this.service
        .postApproval(user.user_id, user.email, user.name)
        .subscribe(isSuccessful => {
          this.openDialog();
          this.updateTable(user.user_id, isSuccessful);
        },
        err => true,
        () => this.isUploading = false);
  }

  onDenyClick(e: MouseEvent, user: any) {
    this.isUploading = true;
    this.service
        .postDenial(user.user_id, user.email, user.name)
        .subscribe(isSuccessful => {
          this.openDialog();
          this.updateTable(user.user_id, isSuccessful);
        },
        err => true,
        () => this.isUploading = false);
  }

  updateTable(userId: number, isSuccessful: boolean) {
    this.pendingRequests = this.pendingRequests.filter(x => x.user_id !== userId);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogRequestCompleteComponent, {
      width: '350px'
    });
  }
}
