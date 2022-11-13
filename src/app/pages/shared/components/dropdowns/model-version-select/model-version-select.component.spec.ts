import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelVersionSelectComponent } from './model-version-select.component';

describe('ModelVersionSelectComponent', () => {
  let component: ModelVersionSelectComponent;
  let fixture: ComponentFixture<ModelVersionSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelVersionSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelVersionSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
