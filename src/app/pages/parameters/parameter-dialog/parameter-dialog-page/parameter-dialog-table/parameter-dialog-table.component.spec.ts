import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDialogTableComponent } from './parameter-dialog-table.component';

describe('ParameterDialogTableComponent', () => {
  let component: ParameterDialogTableComponent;
  let fixture: ComponentFixture<ParameterDialogTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterDialogTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDialogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
