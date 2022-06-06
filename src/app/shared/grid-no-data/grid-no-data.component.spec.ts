import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridNoDataComponent } from './grid-no-data.component';

describe('GridNoDataComponent', () => {
  let component: GridNoDataComponent;
  let fixture: ComponentFixture<GridNoDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridNoDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
