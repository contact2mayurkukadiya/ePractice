import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockoutTypeComponent } from './blockout-type.component';

describe('BlockoutTypeComponent', () => {
  let component: BlockoutTypeComponent;
  let fixture: ComponentFixture<BlockoutTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockoutTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockoutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
