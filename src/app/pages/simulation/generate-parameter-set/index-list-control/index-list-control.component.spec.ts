import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexListControlComponent } from './index-list-control.component';

describe('IndexListControlComponent', () => {
  let component: IndexListControlComponent;
  let fixture: ComponentFixture<IndexListControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexListControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexListControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
