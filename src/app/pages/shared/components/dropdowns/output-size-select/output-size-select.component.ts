import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SimulationService } from 'src/app/pages/simulation/simulation.service';
import { MatSelectChange } from '@angular/material/select';
import { ResultSize } from '../../../../simulation/models/model-setup.model';

@Component({
  selector: 'slu-output-size-select',
  templateUrl: './output-size-select.component.html',
  styleUrls: ['./output-size-select.component.scss']
})
export class OutputSizeSelectComponent implements OnInit {

  @Input() disabled = false;
  @Output() size = new EventEmitter<string>();

  sizeOptions: ResultSize[] = null;
  selectedSize: ResultSize = null;

  constructor(private simulationService: SimulationService) { }

  ngOnInit() {
    this.getOptions();
  }

  getOptions() {
    this.simulationService
        .getResultsLevels()
        .subscribe(res => {
          this.sizeOptions = res;
          this.selectedSize = this.sizeOptions[0];
        });
  }

  onSizeSelect(e: MatSelectChange) {
    const id: number = +e.value;
    this.selectedSize = this.sizeOptions.find(x => +x.id === id);
    this.size.emit(this.selectedSize['model_size_name']);
  }
}
