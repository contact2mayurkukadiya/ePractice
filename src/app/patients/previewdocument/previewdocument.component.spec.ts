import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewdocumentComponent } from './previewdocument.component';

describe('PreviewdocumentComponent', () => {
  let component: PreviewdocumentComponent;
  let fixture: ComponentFixture<PreviewdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
