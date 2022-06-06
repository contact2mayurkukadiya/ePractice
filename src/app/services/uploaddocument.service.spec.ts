import { TestBed } from '@angular/core/testing';

import { UploaddocumentService } from './uploaddocument.service';

describe('UploaddocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploaddocumentService = TestBed.get(UploaddocumentService);
    expect(service).toBeTruthy();
  });
});
