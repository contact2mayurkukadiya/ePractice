import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReferralContactsComponent } from './add-referral.component';

describe('AddReferralContactsComponent', () => {
  let component: AddReferralContactsComponent;
  let fixture: ComponentFixture<AddReferralContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReferralContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReferralContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
