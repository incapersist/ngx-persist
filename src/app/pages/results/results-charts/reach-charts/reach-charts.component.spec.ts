import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachChartsComponent } from './reach-charts.component';

describe('ReachChartsComponent', () => {
  let component: ReachChartsComponent;
  let fixture: ComponentFixture<ReachChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReachChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReachChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
