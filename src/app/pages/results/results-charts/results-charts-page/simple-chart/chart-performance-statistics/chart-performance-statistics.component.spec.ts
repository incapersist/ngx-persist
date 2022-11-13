import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPerformanceStatisticsComponent } from './chart-performance-statistics.component';

describe('ChartPerformanceStatisticsComponent', () => {
  let component: ChartPerformanceStatisticsComponent;
  let fixture: ComponentFixture<ChartPerformanceStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartPerformanceStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartPerformanceStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
