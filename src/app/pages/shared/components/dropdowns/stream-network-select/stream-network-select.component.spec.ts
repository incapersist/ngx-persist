import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamNetworkSelectComponent } from './stream-network-select.component';

describe('StreamNetworkSelectComponent', () => {
  let component: StreamNetworkSelectComponent;
  let fixture: ComponentFixture<StreamNetworkSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamNetworkSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamNetworkSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
