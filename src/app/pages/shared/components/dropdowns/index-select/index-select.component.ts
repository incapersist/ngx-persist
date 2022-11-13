import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SimulationService } from '../../../../simulation/simulation.service';
import { IndexMeta } from '../../../models/index.model';

@Component({
  selector: 'slu-index-select',
  templateUrl: './index-select.component.html',
  styleUrls: ['./index-select.component.scss']
})
export class IndexSelectComponent implements OnInit, OnChanges {

  @Input() modelSetupId: number;
  @Input() indexerId: number;
  @Input() indexId: number;
  @Input() parentForm: FormGroup;
  @Input() selectFirst = false;
  @Output() index = new EventEmitter<any>();

  indexes: IndexMeta[];
  selected: IndexMeta;

  constructor(private service: SimulationService) { }

  ngOnInit() {
    this.formSetup();
  }

  ngOnChanges() {
    this.getIndexes();
  }

  getIndexes() {
    this.service
        .getIndexes(this.modelSetupId, this.indexerId)
        .subscribe(res => {
          this.indexes = res;

          if (this.selectFirst) {
            this.setSelected(this.indexes[0]);
            this.parentForm.controls.indexId.setValue(this.selected.id);
          } else {
            if (this.indexId) {
              const item = this.indexes.find(x => +x.id === +this.indexId);
              this.setSelected(item);
              this.parentForm.controls.indexId.setValue(this.selected.id);
            }
          }
        });
  }

  formSetup() {
    this.parentForm.addControl('indexId', new FormControl('', Validators.required));
  }

  onIndexSelect(e: MatSelectChange) {
 //   this.selected = this.indexes.find(x => +x.id === +e.value);
 //   this.index.emit(this.selected);
    const item = this.indexes.find(x => +x.id === +e.value);
    this.setSelected(item);
  }

  setSelected(item: IndexMeta) {
    this.selected = item;
    this.index.emit(this.selected);
  }

  getError() {
    return this.parentForm.controls.indexId.hasError('required') ? 'You must select an index' :
            '';
  }
}
