import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'slu-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.scss']
})
export class SimulationComponent implements OnInit {

  modelSetupId: number;
  isGenerate = false;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.modelSetupId = +this.route.snapshot.queryParamMap.get('modelSetupId');
    this.isGenerate = (this.route.snapshot.queryParamMap.get('generate') === 'true');
  }
}
