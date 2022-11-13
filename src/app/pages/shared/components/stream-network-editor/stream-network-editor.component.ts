import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StreamNetwork } from '../../models/stream-network.model';
import { ParameterService } from 'src/app/pages/parameters/parameter.service';
import { ReachStructure } from 'src/app/pages/import-data/structure-upload/models/ReachStructure';

@Component({
  selector: 'slu-stream-network-editor',
  templateUrl: './stream-network-editor.component.html',
  styleUrls: ['./stream-network-editor.component.scss']
})
export class StreamNetworkEditorComponent implements OnInit {

  parentForm: FormGroup;
  network: ReachStructure = null;

  isLoading = false;

  constructor(private service: ParameterService) { }

  ngOnInit() {
    if (!this.parentForm) {
      this.parentForm = new FormGroup({});
    }
  }

  getStreamNetwork(streamNetworkMeta: StreamNetwork) {
    this.isLoading = true;
    this.service
      .getStreamNetwork(streamNetworkMeta.id)
      .subscribe(res => {
        this.network = new ReachStructure(res[0]['json']);
        this.isLoading = false;
      });
  }
}
