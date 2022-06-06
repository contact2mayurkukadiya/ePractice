import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentOptionsComponent } from './appointment-options.component';

describe('AppointmentOptionsComponent', () => {
  let component: AppointmentOptionsComponent;
  let fixture: ComponentFixture<AppointmentOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
