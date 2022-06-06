import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscountTypeComponent } from './add-discount-type.component';

describe('AddDiscountTypeComponent', () => {
  let component: AddDiscountTypeComponent;
  let fixture: ComponentFixture<AddDiscountTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiscountTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiscountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
