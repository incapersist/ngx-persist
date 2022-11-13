import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncaDataDownloadComponent } from './inca-data-download.component';

describe('IncaDataDownloadComponent', () => {
  let component: IncaDataDownloadComponent;
  let fixture: ComponentFixture<IncaDataDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncaDataDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncaDataDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
