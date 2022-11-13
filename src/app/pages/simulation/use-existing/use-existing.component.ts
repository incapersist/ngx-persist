import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'slu-use-existing',
  templateUrl: './use-existing.component.html',
  styleUrls: ['./use-existing.component.scss']
})
export class UseExistingComponent implements OnInit {

  @Input() modelSetupId: number = null;

  constructor() { }

  ngOnInit() {
  }

}
