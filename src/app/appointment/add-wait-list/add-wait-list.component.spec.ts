import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWaitListComponent } from './add-wait-list.component';

describe('AddWaitListComponent', () => {
  let component: AddWaitListComponent;
  let fixture: ComponentFixture<AddWaitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWaitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWaitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
