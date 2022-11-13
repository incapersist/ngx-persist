import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultsItemMeta } from '../../results.model';

@Component({
  selector: 'slu-reach-charts',
  templateUrl: './reach-charts.component.html',
  styleUrls: ['./reach-charts.component.scss']
})
export class ReachChartsComponent implements OnInit, OnChanges {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() reachId: number = null;
  @Input() parentForm: FormGroup;
  @Input() itemMeta: ResultsItemMeta[];

  outputPageIds = [14, 15, 16];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemMeta'] && changes['itemMeta'].currentValue) {
      this.outputPageIds = (this.itemMeta[0].modelVersionCoreId > 1) ? [14, 15, 16, 23] : [14, 15, 16];
    }
  }

}
