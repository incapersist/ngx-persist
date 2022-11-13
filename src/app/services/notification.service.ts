// Modified from:
// https://blog.angularindepth.com/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4
import { Injectable, NgZone} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  showSuccess(message: string): void {
    this.snackBar.open(message);
  }

  showError(message: string): void {
    // https://github.com/angular/components/issues/9875
    this.zone.run(() => {
      const snackBar = this.snackBar.open(message, 'X', {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['error-notification']
      });

      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }
}
