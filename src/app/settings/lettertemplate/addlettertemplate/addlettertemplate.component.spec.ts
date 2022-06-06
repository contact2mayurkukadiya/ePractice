import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlettertemplateComponent } from './addlettertemplate.component';

describe('AddlettertemplateComponent', () => {
  let component: AddlettertemplateComponent;
  let fixture: ComponentFixture<AddlettertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlettertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlettertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
