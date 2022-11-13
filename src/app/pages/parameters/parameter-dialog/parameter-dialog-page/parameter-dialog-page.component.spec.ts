import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterDialogPageComponent } from './parameter-dialog-page.component';

describe('ParameterDialogPageComponent', () => {
  let component: ParameterDialogPageComponent;
  let fixture: ComponentFixture<ParameterDialogPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterDialogPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterDialogPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
