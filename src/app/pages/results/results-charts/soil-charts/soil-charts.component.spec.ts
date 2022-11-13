import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoilChartsComponent } from './soil-charts.component';

describe('SoilChartsComponent', () => {
  let component: SoilChartsComponent;
  let fixture: ComponentFixture<SoilChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoilChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoilChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
