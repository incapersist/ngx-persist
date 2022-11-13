import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'slu-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent implements OnInit {

  isResultsDownloadVisible = true;
  isIncaDownloadVisible = true;
  isParameterDownloadVisible = true;
  isInputDownloadVisible = true;
  isStructureDownloadVisible = true;

  constructor() { }

  ngOnInit() {
  }

}
