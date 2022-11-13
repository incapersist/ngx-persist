import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { faTachometerAlt, faFileImport, faCalculator, faSquareRootAlt, faChartBar, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: '[slu-side-nav]',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SideNavComponent implements OnInit, OnChanges {
  @Input() isSidenavVisible = true;
  @ViewChild('sidenav', { static: true }) nav: MatSidenav;

  opened: boolean = true;
  faTachometerAlt = faTachometerAlt;
  faFileImport = faFileImport;
  faCalculator = faCalculator;
  faSquareRootAlt = faSquareRootAlt;
  faChartBar = faChartBar;
  faProjectDiagram = faProjectDiagram;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.opened = this.isSidenavVisible;
    this.nav.open();
  }
}
