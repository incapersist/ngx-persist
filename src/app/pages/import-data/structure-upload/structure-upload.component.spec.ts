import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureUploadComponent } from './structure-upload.component';

describe('StructureUploadComponent', () => {
  let component: StructureUploadComponent;
  let fixture: ComponentFixture<StructureUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
