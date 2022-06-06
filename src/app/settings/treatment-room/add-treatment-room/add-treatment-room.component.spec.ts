import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatmentRoomComponent } from './add-treatment-room.component';

describe('AddTreatmentRoomComponent', () => {
  let component: AddTreatmentRoomComponent;
  let fixture: ComponentFixture<AddTreatmentRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTreatmentRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTreatmentRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
