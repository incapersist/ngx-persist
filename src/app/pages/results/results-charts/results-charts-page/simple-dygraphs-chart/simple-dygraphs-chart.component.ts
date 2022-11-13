import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { ResultsService } from '../../../results.service';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'slu-simple-dygraphs-chart',
  templateUrl: './simple-dygraphs-chart.component.html',
  styleUrls: ['./simple-dygraphs-chart.component.scss']
})
export class SimpleDygraphsChartComponent implements OnInit, OnChanges {

  @ViewChild('chart', {static: false}) chart;

  @Input() resultTypeId: number;
  @Input() runId: number;
  @Input() startDate: string = null;
  @Input() itemId: number;
  @Input() reachId: number;
  @Input() soilId: number = null;
  @Input() showXaxisLabel = false;
  @Input() extraId: number = null;
  @Input() title: string = null;

  @Output() complete = new EventEmitter<boolean>();

 // title: string;
  units: string;
  chartData: any[];
  labels: Date[];
  show = false;
  results: number[];
  progress = 0;
  showProgress = false;
  startDateAsDate: Date = new Date();
  colors: any[];
  isMultiLine = false;

  constructor(private resultsService: ResultsService) { }

    // https://github.com/chartjs/Chart.js/issues/815
    default_colors = [
      '#3366CC',
      '#DC3912',
      '#FF9900',
      '#109618',
      '#990099',
      '#3B3EAC',
      '#0099C6',
      '#DD4477',
      '#66AA00',
      '#B82E2E',
      '#316395',
      '#994499',
      '#22AA99',
      '#AAAA11',
      '#6633CC',
      '#E67300',
      '#8B0707',
      '#329262',
      '#5574A6',
      '#3B3EAC'
    ];

  options = {
    width: 'auto',
    height: '200',
    labels: [],
    ylabel: 'Y label text',
    title: 'Working title :)',
    animatedZooms: true,
    legend: 'none',
    colors: [],
    pointSize: 1,
    sigFigs: 2,
    axisLabelWidth: 65,
    titleHeight: 24,
    visibility: [true, false, false],
  };

  ngOnInit() {
    this.startDateAsDate = new Date(this.startDate);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getResults();
  }

  getResults() {
    this.results = null;
    this.progress = 0;

    this.resultsService
        .getResults(this.resultTypeId, this.runId, this.itemId, this.reachId, null, this.soilId, this.extraId)
        .subscribe(event => {
          // progress
          if (event.type === HttpEventType.DownloadProgress) {
            this.progress = 100 / event.total * event.loaded;
          }
          // finished
          if (event.type === HttpEventType.Response) {
            this.showProgress = false;

            if (!this.title) {
              this.title = event.body['title'];
            }

            this.units = event.body['units'];
            this.setChartData(event.body['data'][0]['results']);
          }
        });
  }
  setChartData(res: any) {
    this.chartData = Object.assign([], []);
    const sd = new Date(this.startDateAsDate);
    this.options.labels = [];
    this.options.labels.push('Date');

    if (Array.isArray(res) && res.length > 0 && res[0].hasOwnProperty('reference')) {
      this.isMultiLine = true;

      const points = [];
      const results = [];

      for (const item of res) {
        results.push(item['results'].map(x => +x['result']));
      }

      for (let day = 0; day < res[0]['results'].length; ++day) {
        sd.setDate(sd.getDate() + 1);
        const cols = [];
        cols.push(new Date(sd));

        for (let j = 0; j < res.length; j++) {
          cols.push(results[j][day]);
        }

        points.push(cols);
      }

      let i = 0;
      for (const item of res) {
        this.options.labels.push(item.reference);
        this.options.colors.push(this.default_colors[i]);
        ++i;
      }

      this.options.legend = 'always';

      this.chartData = [...points];
    } else {
      this.isMultiLine = false;

       this.options.labels.push('Observed');
       this.options.colors.push('#DC3912');
       this.options.labels.push('Simulated');
       this.options.colors.push('#3366CC');

    //  this.options.labels = ['Observed', 'Simulated'];
   //   this.options.colors = ['#DC3912', '#3366CC'];

      this.chartData = res.map(row => [new Date(row['resultDate']), parseFloat(row['observed']), +row['result']]);
    }

    this.options.title = this.title;
    this.options.ylabel = this.units;

    this.show = true;
    this.complete.emit(true);
  }

  changeVisibility(event) {
   this.chart.changeVisibility(event);
  }

}
