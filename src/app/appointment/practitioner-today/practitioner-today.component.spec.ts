import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PractitionerTodayComponent } from './practitioner-today.component';

describe('PractitionerTodayComponent', () => {
  let component: PractitionerTodayComponent;
  let fixture: ComponentFixture<PractitionerTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PractitionerTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PractitionerTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
