import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceStatisticsTableComponent } from './performance-statistics-table.component';

describe('PerformanceStatisticsTableComponent', () => {
  let component: PerformanceStatisticsTableComponent;
  let fixture: ComponentFixture<PerformanceStatisticsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceStatisticsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceStatisticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
