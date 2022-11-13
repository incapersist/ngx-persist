import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilLandChartsComponent } from './soil-land-charts.component';

describe('SoilLandChartsComponent', () => {
  let component: SoilLandChartsComponent;
  let fixture: ComponentFixture<SoilLandChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoilLandChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilLandChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
