import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatmentNotesComponent } from './add-treatment-notes.component';

describe('AddTreatmentNotesComponent', () => {
  let component: AddTreatmentNotesComponent;
  let fixture: ComponentFixture<AddTreatmentNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTreatmentNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTreatmentNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
