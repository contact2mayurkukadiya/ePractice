import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMissedReasonComponent } from './add-missed-reason.component';

describe('AddMissedReasonComponent', () => {
  let component: AddMissedReasonComponent;
  let fixture: ComponentFixture<AddMissedReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMissedReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMissedReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
