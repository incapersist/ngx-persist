import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ParameterService } from '../../parameters/parameter.service';
import { StreamNetworkDownload } from './stream-network-download';

@Component({
  selector: 'slu-stream-network-download',
  templateUrl: './stream-network-download.component.html',
  styleUrls: ['./stream-network-download.component.scss']
})
export class StreamNetworkDownloadComponent implements OnInit {

  networkDownloadForm: FormGroup;

  constructor(private service: ParameterService) { }

  ngOnInit() {
    this.networkDownloadForm = new FormGroup({});
  }

  onStreamNetworkSelect(streamNetwork: any) {
    const psd = new StreamNetworkDownload(this.service);
    psd.download(+streamNetwork.id, streamNetwork.reference);
  }
}
