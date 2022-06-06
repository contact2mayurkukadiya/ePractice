import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpineChartComponent } from './spine-chart.component';

describe('SpineChartComponent', () => {
  let component: SpineChartComponent;
  let fixture: ComponentFixture<SpineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
