import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSetListComponent } from './results-set-list.component';

describe('ResultsSetListComponent', () => {
  let component: ResultsSetListComponent;
  let fixture: ComponentFixture<ResultsSetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsSetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsSetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
