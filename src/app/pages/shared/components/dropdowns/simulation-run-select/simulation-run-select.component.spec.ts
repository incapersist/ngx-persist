import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationRunSelectComponent } from './simulation-run-select.component';

describe('SimulationRunSelectComponent', () => {
  let component: SimulationRunSelectComponent;
  let fixture: ComponentFixture<SimulationRunSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulationRunSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimulationRunSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
