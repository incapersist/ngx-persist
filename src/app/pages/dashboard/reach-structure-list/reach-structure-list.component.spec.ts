import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachStructureListComponent } from './reach-structure-list.component';

describe('ReachStructureListComponent', () => {
  let component: ReachStructureListComponent;
  let fixture: ComponentFixture<ReachStructureListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReachStructureListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReachStructureListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
