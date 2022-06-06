import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedReasonComponent } from './missed-reason.component';

describe('MissedReasonComponent', () => {
  let component: MissedReasonComponent;
  let fixture: ComponentFixture<MissedReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissedReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
