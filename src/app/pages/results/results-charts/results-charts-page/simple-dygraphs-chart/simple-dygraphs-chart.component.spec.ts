import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDygraphsChartComponent } from './simple-dygraphs-chart.component';

describe('SimpleDygraphsChartComponent', () => {
  let component: SimpleDygraphsChartComponent;
  let fixture: ComponentFixture<SimpleDygraphsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleDygraphsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleDygraphsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
