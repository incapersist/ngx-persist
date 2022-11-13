import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SimulationService } from 'src/app/pages/simulation/simulation.service';
import { ResultsItemMeta } from '../../results.model';

@Component({
  selector: 'slu-soil-charts',
  templateUrl: './soil-charts.component.html',
  styleUrls: ['./soil-charts.component.scss']
})
export class SoilChartsComponent implements OnInit {

  @Input() runId: number = null;
  @Input() startDate: string = null;
  @Input() reachId: number = null;
  @Input() parentForm: FormGroup;
  @Input() itemMeta: ResultsItemMeta[];

  soils: any[];

  constructor(private service: SimulationService) { }

  ngOnInit() {
    this.getIndexes();
  }

  getIndexes() {
    this.service
        .getIndexes(this.runId, 3)
        .subscribe(res => {
          this.soils = res;
        });
  }
}
