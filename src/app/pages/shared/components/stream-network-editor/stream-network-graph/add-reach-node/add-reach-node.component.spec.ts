import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReachNodeComponent } from './add-reach-node.component';

describe('AddReachNodeComponent', () => {
  let component: AddReachNodeComponent;
  let fixture: ComponentFixture<AddReachNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReachNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReachNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
