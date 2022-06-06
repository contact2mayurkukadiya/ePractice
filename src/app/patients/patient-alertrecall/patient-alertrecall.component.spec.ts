import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientAlertrecallComponent } from './patient-alertrecall.component';

describe('PatientAlertrecallComponent', () => {
  let component: PatientAlertrecallComponent;
  let fixture: ComponentFixture<PatientAlertrecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientAlertrecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAlertrecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
