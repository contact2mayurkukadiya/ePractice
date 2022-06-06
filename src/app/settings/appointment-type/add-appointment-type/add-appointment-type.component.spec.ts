import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAppointmentTypeComponent } from './add-appointment-type.component';

describe('AddAppointmentTypeComponent', () => {
  let component: AddAppointmentTypeComponent;
  let fixture: ComponentFixture<AddAppointmentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAppointmentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAppointmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
