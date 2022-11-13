import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandChartsComponent } from './land-charts.component';

describe('LandChartsComponent', () => {
  let component: LandChartsComponent;
  let fixture: ComponentFixture<LandChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
