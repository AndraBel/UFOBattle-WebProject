import { TestBed } from '@angular/core/testing';

import { MessagesMgrService } from './messages-mgr.service';

describe('MessagesMgrService', () => {
  let service: MessagesMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
