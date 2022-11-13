import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelSetupListComponent } from './model-setup-list.component';

describe('ModelSetupListComponent', () => {
  let component: ModelSetupListComponent;
  let fixture: ComponentFixture<ModelSetupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelSetupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
