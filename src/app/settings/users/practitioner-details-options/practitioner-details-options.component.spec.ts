import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerDetailsOptionsComponent } from './practitioner-details-options.component';

describe('PractitionerDetailsOptionsComponent', () => {
  let component: PractitionerDetailsOptionsComponent;
  let fixture: ComponentFixture<PractitionerDetailsOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerDetailsOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerDetailsOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
