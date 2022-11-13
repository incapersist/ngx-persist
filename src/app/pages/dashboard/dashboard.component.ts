import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { SnapshotCount } from './dashboard.model';

@Component({
  selector: 'slu-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  snapshots: SnapshotCount[];

  constructor(private service: DashboardService) {
  }

  ngOnInit() {
    this.getCounts();
  }

  getCounts() {
    this.service
        .getCounts()
        .subscribe(counts => {
          this.snapshots = counts;
          for (let i = 0; i < this.snapshots.length; i++) {
            this.snapshots[i].isOpen = false;
            if (+this.snapshots[i].count === 1) {
              this.snapshots[i].title = this.snapshots[i].title.slice(0, -1);
            }
          }
        });
  }

  onDeleteDone(isDeleted: boolean) {
    if (isDeleted) {
      this.getCounts();
    }
  }

  onCardClick(event: MouseEvent, snapshot: SnapshotCount) {
    if (event) {
      event.stopPropagation();
    }

    snapshot.isOpen = !snapshot.isOpen;
  }
}
