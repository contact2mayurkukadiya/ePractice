import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyChartComponent } from './body-chart.component';

describe('BodyChartComponent', () => {
  let component: BodyChartComponent;
  let fixture: ComponentFixture<BodyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BodyChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});