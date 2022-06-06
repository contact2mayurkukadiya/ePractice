import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettertemplateComponent } from './lettertemplate.component';

describe('LettertemplateComponent', () => {
  let component: LettertemplateComponent;
  let fixture: ComponentFixture<LettertemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettertemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettertemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
