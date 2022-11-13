import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseExistingComponent } from './use-existing.component';

describe('UseExistingComponent', () => {
  let component: UseExistingComponent;
  let fixture: ComponentFixture<UseExistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseExistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
