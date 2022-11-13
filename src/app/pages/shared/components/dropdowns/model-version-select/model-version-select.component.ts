import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SimulationService } from '../../../../simulation/simulation.service';
import { ModelVersion } from '../../../../simulation/models/model-setup.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'slu-model-version-select',
  templateUrl: './model-version-select.component.html',
  styleUrls: ['./model-version-select.component.scss']
})
export class ModelVersionSelectComponent implements OnInit {

  @Output() versionId = new EventEmitter<number>();
  @Output() version = new EventEmitter<ModelVersion>();
  @Output() count = new EventEmitter<number>();

  versions: ModelVersion[] = null;
  selectedVerion: ModelVersion = null;

  constructor(private simulationService: SimulationService) { }

  ngOnInit() {
    this.getVersions();
  }

  getVersions() {
    this.simulationService
        .getModelVersions()
        .subscribe(versions => {
          this.versions = versions;
          this.count.emit(this.versions.length);
        });
  }

  onVersionSelect(e: MatSelectChange) {
    const versionId: number = +e.value;
    this.selectedVerion = this.versions.find(x => +x.id === versionId);
    this.versionId.emit(versionId);
    this.version.emit(this.selectedVerion);
  }
}
