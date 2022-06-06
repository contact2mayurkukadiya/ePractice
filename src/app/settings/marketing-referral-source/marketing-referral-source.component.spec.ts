import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingReferralSourceComponent } from './marketing-referral-source.component';

describe('MarketingReferralSourceComponent', () => {
  let component: MarketingReferralSourceComponent;
  let fixture: ComponentFixture<MarketingReferralSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingReferralSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingReferralSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
