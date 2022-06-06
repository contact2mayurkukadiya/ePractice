import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConcessionComponent } from './add-concession.component';

describe('AddConcessionComponent', () => {
  let component: AddConcessionComponent;
  let fixture: ComponentFixture<AddConcessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConcessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConcessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
