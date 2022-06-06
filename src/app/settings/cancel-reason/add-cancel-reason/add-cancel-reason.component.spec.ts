import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCancelReasonComponent } from './add-cancel-reason.component';

describe('AddCancelReasonComponent', () => {
  let component: AddCancelReasonComponent;
  let fixture: ComponentFixture<AddCancelReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCancelReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCancelReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
