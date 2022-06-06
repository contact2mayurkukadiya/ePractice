import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddemailtemplateComponent } from './addemailtemplate.component';

describe('AddemailtemplateComponent', () => {
  let component: AddemailtemplateComponent;
  let fixture: ComponentFixture<AddemailtemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddemailtemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddemailtemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
