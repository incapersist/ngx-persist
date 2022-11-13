import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamNetworkEditorComponent } from './stream-network-editor.component';

describe('StreamNetworkEditorComponent', () => {
  let component: StreamNetworkEditorComponent;
  let fixture: ComponentFixture<StreamNetworkEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamNetworkEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamNetworkEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
