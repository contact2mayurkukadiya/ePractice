import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlockoutTypeComponent } from './add-blockout-type.component';

describe('AddBlockoutTypeComponent', () => {
  let component: AddBlockoutTypeComponent;
  let fixture: ComponentFixture<AddBlockoutTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBlockoutTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlockoutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
