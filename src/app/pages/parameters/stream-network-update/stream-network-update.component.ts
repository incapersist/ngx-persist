import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ParameterService } from '../parameter.service';
import { ReachStructure } from '../../import-data/structure-upload/models/ReachStructure';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'slu-stream-network-update',
  templateUrl: './stream-network-update.component.html',
  styleUrls: ['./stream-network-update.component.css']
})
export class StreamNetworkUpdateComponent implements OnInit, AfterViewChecked {

  @Input() parameterSetId: number = null;
  @Input() parentForm: FormGroup;

  network: ReachStructure = null;
  newReachStructure: ReachStructure = null;
  isNetworkEdited = true;

  constructor(private service: ParameterService,
              private changeDetect: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.parentForm) {
      this.parentForm = new FormGroup({});
    }
    this.getNetwork();
  }

  ngAfterViewChecked(): void {
    this.changeDetect.detectChanges();
  }

  getNetwork() {
    this.service
        .getStreamNetworkJson(this.parameterSetId)
        .subscribe(res => {
          this.network = new ReachStructure(res[0]['json']);
        });
  }

  onStructureChange(structure: ReachStructure) {
    this.newReachStructure = structure;
  }

  updateNetwork() {
    this.service
        .putStreamNetwork(this.parameterSetId, this.newReachStructure)
        .subscribe(res => {
          this.newReachStructure = null;
          this.network = new ReachStructure(res[0]['json']);
        });
  }
}
