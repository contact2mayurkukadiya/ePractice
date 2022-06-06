import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCommmunicationsComponent } from './patient-commmunications.component';

describe('PatientCommmunicationsComponent', () => {
  let component: PatientCommmunicationsComponent;
  let fixture: ComponentFixture<PatientCommmunicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientCommmunicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientCommmunicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
