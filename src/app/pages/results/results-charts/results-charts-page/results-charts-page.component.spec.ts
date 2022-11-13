import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsChartsPageComponent } from './results-charts-page.component';

describe('ResultsChartsPageComponent', () => {
  let component: ResultsChartsPageComponent;
  let fixture: ComponentFixture<ResultsChartsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsChartsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsChartsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
