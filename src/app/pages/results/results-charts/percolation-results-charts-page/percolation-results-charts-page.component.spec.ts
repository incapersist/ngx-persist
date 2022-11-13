import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercolationResultsChartsPageComponent } from './percolation-results-charts-page.component';

describe('PercolationResultsChartsPageComponent', () => {
  let component: PercolationResultsChartsPageComponent;
  let fixture: ComponentFixture<PercolationResultsChartsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercolationResultsChartsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercolationResultsChartsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
