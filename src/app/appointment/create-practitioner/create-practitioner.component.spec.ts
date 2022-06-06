import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePractitionerComponent } from './create-practitioner.component';

describe('CreatePractitionerComponent', () => {
  let component: CreatePractitionerComponent;
  let fixture: ComponentFixture<CreatePractitionerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePractitionerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePractitionerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
