import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGeneralContactsComponent } from './add-general.component';

describe('AddGeneralContactsComponent', () => {
  let component: AddGeneralContactsComponent;
  let fixture: ComponentFixture<AddGeneralContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGeneralContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGeneralContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
