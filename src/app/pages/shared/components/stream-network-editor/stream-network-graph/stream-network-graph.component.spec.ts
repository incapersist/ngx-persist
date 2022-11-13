import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamNetworkGraphComponent } from './stream-network-graph.component';

describe('StreamNetworkGraphComponent', () => {
  let component: StreamNetworkGraphComponent;
  let fixture: ComponentFixture<StreamNetworkGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamNetworkGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamNetworkGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
