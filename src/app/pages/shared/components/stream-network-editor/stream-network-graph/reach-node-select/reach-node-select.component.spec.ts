import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachNodeSelectComponent } from './reach-node-select.component';

describe('ReachNodeSelectComponent', () => {
  let component: ReachNodeSelectComponent;
  let fixture: ComponentFixture<ReachNodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReachNodeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReachNodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
