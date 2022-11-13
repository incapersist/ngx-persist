import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDialogDropdownComponent } from './parameter-dialog-dropdown.component';

describe('ParameterDialogDropdownComponent', () => {
  let component: ParameterDialogDropdownComponent;
  let fixture: ComponentFixture<ParameterDialogDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterDialogDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDialogDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
