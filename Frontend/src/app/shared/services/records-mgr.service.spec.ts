import { TestBed } from '@angular/core/testing';

import { RecordsMgrService } from './records-mgr.service';

describe('RecordsMgrService', () => {
  let service: RecordsMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordsMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
