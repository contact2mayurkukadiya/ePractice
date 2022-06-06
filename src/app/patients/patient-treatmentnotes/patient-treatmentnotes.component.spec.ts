import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTreatmentnotesComponent } from './patient-treatmentnotes.component';

describe('PatientTreatmentnotesComponent', () => {
  let component: PatientTreatmentnotesComponent;
  let fixture: ComponentFixture<PatientTreatmentnotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientTreatmentnotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTreatmentnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
