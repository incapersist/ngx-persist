import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'slu-soil-land-charts',
  templateUrl: './soil-land-charts.component.html',
  styleUrls: ['./soil-land-charts.component.scss']
})
export class SoilLandChartsComponent implements OnInit {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() reachId: number = null;
  @Input() soilId: number = null;
  @Input() parentForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
