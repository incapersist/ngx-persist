import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SimulationService } from 'src/app/pages/simulation/simulation.service';
import { MatSelectChange } from '@angular/material/select';
import { ModelSetupMeta } from '../../../../simulation/models/model-setup.model';

@Component({
  selector: 'slu-simulation-run-select',
  templateUrl: './simulation-run-select.component.html',
  styleUrls: ['./simulation-run-select.component.scss']
})
export class SimulationRunSelectComponent implements OnInit, OnChanges {

  @Input() resultsRequired = false;
  @Input() modelSetupId: number = null;
  @Input() parameterSetId: number = null;
  @Input() showNoneOption = false;
  @Input() disabled = false;

  @Output() runId = new EventEmitter<number>();
  @Output() run = new EventEmitter<ModelSetupMeta>();
  @Output() count = new EventEmitter<number>();

  runs: ModelSetupMeta[] = null;
  selectedRun: ModelSetupMeta = null;

  constructor(private simulationService: SimulationService) { }

  ngOnInit() {
    this.getRuns();
    this.simulationService.newModelSetup$.subscribe(res => this.addNewModelSetup(res));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelSetupId'] && changes['modelSetupId'].currentValue) {
      this.setSelected(+this.modelSetupId);
      if (this.selectedRun) { this.run.emit(this.selectedRun); }
    }
    if (changes['parameterSetId']) {
      this.getRuns();
    }
  }

  setSelected(id: number) {
    if (this.runs && this.runs.length > 0) {
      this.selectedRun = this.runs.find(x => +x.id === id);
    }
  }

  getRuns() {
    this.simulationService
        .getModelSetups(this.parameterSetId, this.resultsRequired)
        .subscribe(res => {
          this.runs = res;
          this.count.emit(this.runs.length);

          if (this.modelSetupId) {
            this.setSelected(this.modelSetupId);
            this.run.emit(this.selectedRun);
          }
        });
  }

  onRunSelect(e: MatSelectChange) {
    const runId: number = +e.value;
    this.selectedRun = this.runs.find(x => +x.id === runId);
    this.runId.emit(runId);
    this.run.emit(this.selectedRun);
  }

  addNewModelSetup(res: any) {
    const exists = this.runs.find(x => +x.id === +res[0].id);
    if (!exists) {
      this.runs.unshift(res[0]);
    }

    this.count.emit(this.runs.length);
  }
}
