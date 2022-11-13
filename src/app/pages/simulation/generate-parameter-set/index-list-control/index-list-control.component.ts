import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IndexerName, Index } from '../../models/indexer';
import { SimulationService } from '../../simulation.service';
import { v4 as uuid } from 'uuid';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'slu-index-list-control',
  templateUrl: './index-list-control.component.html',
  styleUrls: ['./index-list-control.component.scss']
})
export class IndexListControlComponent implements OnInit {

  @Input() indexer: IndexerName = null;
  @Input() indexes: Index[] = [];
  @Output() list = new EventEmitter<Index[]>();

  existingIndexes: Index[];
  availableIndexes: Index[];
  currentIndexes: Index[];
  newIndex: string;
  referenceId: string = uuid();
  selectedIndex: Index = undefined;
  maxDisplayLength = 5;
  showAll = false;

  constructor(private simulationService: SimulationService) { }

  ngOnInit() {
    this.currentIndexes = Array.from(this.indexes);
    this.getExistingIndexes();
  }

  getExistingIndexes() {
    this.simulationService
        .getIndexes(null, this.indexer.id)
        .subscribe(indexes => {
          this.existingIndexes = [];
          for (const index of indexes) {
            this.existingIndexes.push(new Index(index.reference, +index.id));
          }
          this.setAvailableIndexes();
        });
  }

  onIndexSelect(e: MatSelectChange) {
    const indexId: number = +e.value;
    this.selectedIndex = this.availableIndexes.find(x => +x.id === indexId);
  }

  onAddAvailableIndexClick(index: Index) {
    if (this.selectedIndex) {
      this.currentIndexes.push(index);
      this.setAvailableIndexes();
      this.list.emit(this.currentIndexes);
      this.selectedIndex = undefined;
    }
  }

  onRemoveIndexClick(index: Index) {
    this.currentIndexes = this.currentIndexes.filter(x => x.reference !== index.reference);
    this.setAvailableIndexes();
    this.list.emit(this.currentIndexes);
  }

  indexExists(): boolean {
    return this.currentIndexes.map(index => index.reference.toUpperCase()).includes(this.newIndex.toUpperCase());
  }

  onAddNewIndexClick() {
    if (this.newIndex) {
      this.currentIndexes.push(new Index(this.newIndex));
      this.newIndex = null;
      this.list.emit(this.currentIndexes);
    }
  }

  setAvailableIndexes() {
    this.availableIndexes = this.existingIndexes.filter(x => !this.currentIndexes.map(y => y.reference).includes(x.reference));
    this.availableIndexes.sort((a, b) => a.reference.localeCompare(b.reference));
  }
}
