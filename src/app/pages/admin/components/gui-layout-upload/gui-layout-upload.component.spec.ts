import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiLayoutUploadComponent } from './gui-layout-upload.component';

describe('GuiLayoutUploadComponent', () => {
  let component: GuiLayoutUploadComponent;
  let fixture: ComponentFixture<GuiLayoutUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuiLayoutUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiLayoutUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
