import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDataListComponent } from './input-data-list.component';

describe('InputDataListComponent', () => {
  let component: InputDataListComponent;
  let fixture: ComponentFixture<InputDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
