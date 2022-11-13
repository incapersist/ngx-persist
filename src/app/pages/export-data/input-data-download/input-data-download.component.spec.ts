import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDataDownloadComponent } from './input-data-download.component';

describe('InputDataDownloadComponent', () => {
  let component: InputDataDownloadComponent;
  let fixture: ComponentFixture<InputDataDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDataDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDataDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
