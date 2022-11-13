import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { StreamNetwork } from '../../../models/stream-network.model';
import { ParameterService } from 'src/app/pages/parameters/parameter.service';

@Component({
  selector: 'slu-stream-network-select',
  templateUrl: './stream-network-select.component.html',
  styleUrls: ['./stream-network-select.component.scss']
})
export class StreamNetworkSelectComponent implements OnInit {

  @Input() parentForm: FormGroup = null;
  @Input() required = true;
  @Input() ref: string = uuid();
  @Input() parameterSetId: number = null;

  @Output() network = new EventEmitter<StreamNetwork>();

  networks: StreamNetwork[];
  selected: StreamNetwork;

  constructor(private service: ParameterService) {}

  ngOnInit() {
    this.formSetup();
    this.getStreamNetworks();
  }

  getStreamNetworks() {
    this.service
        .getStreamNetworks(this.parameterSetId)
        .subscribe(res => {
          this.networks = res;
        });
  }

  formSetup() {
    if (this.required) {
      this.parentForm.addControl(this.ref, new FormControl('', Validators.required));
    } else {
      this.parentForm.addControl(this.ref, new FormControl({}));
      // Instantiating a FormControl with an empty object  ^
      // makes sure there are no validators attached
    }
  }

  onStreamNetworkSelect(e: MatSelectChange) {
    this.selected = this.networks.find(x => +x.id === +e.value);
    this.network.emit(this.selected);
  }

  getError() {
    return this.parentForm.controls[this.ref].hasError('required') ? 'You must select a stream network' :
            '';
  }
}
