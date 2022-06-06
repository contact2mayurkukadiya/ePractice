import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketingReferralSourceComponent } from './add-marketing-referral-source.component';

describe('AddMarketingReferralSourceComponent', () => {
  let component: AddMarketingReferralSourceComponent;
  let fixture: ComponentFixture<AddMarketingReferralSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarketingReferralSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketingReferralSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
