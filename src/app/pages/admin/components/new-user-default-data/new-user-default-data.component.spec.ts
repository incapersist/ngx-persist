import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserDefaultDataComponent } from './new-user-default-data.component';

describe('NewUserDefaultDataComponent', () => {
  let component: NewUserDefaultDataComponent;
  let fixture: ComponentFixture<NewUserDefaultDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserDefaultDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserDefaultDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
