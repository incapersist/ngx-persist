import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamNetworkUpdateComponent } from './stream-network-update.component';

describe('StreamNetworkUpdateComponent', () => {
  let component: StreamNetworkUpdateComponent;
  let fixture: ComponentFixture<StreamNetworkUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamNetworkUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamNetworkUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
