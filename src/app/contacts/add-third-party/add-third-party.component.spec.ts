import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddThirdPartyContactsComponent } from './add-third-party.component';

describe('AddThirdPartyContactsComponent', () => {
  let component: AddThirdPartyContactsComponent;
  let fixture: ComponentFixture<AddThirdPartyContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddThirdPartyContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddThirdPartyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
