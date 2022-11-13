import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateParameterSetComponent } from './generate-parameter-set.component';

describe('GenerateParameterSetComponent', () => {
  let component: GenerateParameterSetComponent;
  let fixture: ComponentFixture<GenerateParameterSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateParameterSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateParameterSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
