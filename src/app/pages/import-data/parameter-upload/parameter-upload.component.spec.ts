import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterUploadComponent } from './parameter-upload.component';

describe('ParameterUploadComponent', () => {
  let component: ParameterUploadComponent;
  let fixture: ComponentFixture<ParameterUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParameterUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
