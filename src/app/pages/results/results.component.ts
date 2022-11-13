import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'slu-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  runId: number = null;
  reachId: number = null;
  resultsForm: FormGroup;
  availableResultsCount: number;
  isRunCountRetrieved = false;
  showPerformanceStatistics = true;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.resultsForm = new FormGroup({});

    this.reachId = +this.route.snapshot.queryParamMap.get('reachId');
    const id = +this.route.snapshot.queryParamMap.get('id');

    if (id) {
      this.onRunSelect(id);
    }
  }

  onRunSelect(modelRunId: number) {
    this.runId = modelRunId;
  }

  onRunCountChange(count: number) {
    this.availableResultsCount = count;
    this.isRunCountRetrieved = true;
  }
}
