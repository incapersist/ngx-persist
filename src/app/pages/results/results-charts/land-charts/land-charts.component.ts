import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResultsItemMeta } from '../../results.model';

@Component({
  selector: 'slu-land-charts',
  templateUrl: './land-charts.component.html',
  styleUrls: ['./land-charts.component.scss']
})
export class LandChartsComponent implements OnInit, OnChanges {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() reachId: number = null;
  @Input() parentForm: FormGroup;
  @Input() itemMeta: ResultsItemMeta[];

  snowPageIds = [1, 2, 3, 4];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemMeta'] && changes['itemMeta'].currentValue) {
      this.snowPageIds = (this.itemMeta[0].modelVersionCoreId > 2) ? [1, 2, 3, 4, 25] : [1, 2, 3, 4];
    }
  }

}
