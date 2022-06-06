import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientTabContentComponent } from './patient-tab-content.component';

describe('PatientTabContentComponent', () => {
  let component: PatientTabContentComponent;
  let fixture: ComponentFixture<PatientTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientTabContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
