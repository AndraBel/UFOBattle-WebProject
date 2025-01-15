import { TestBed } from '@angular/core/testing';

import { TokenMgrService } from './token-mgr.service';

describe('TokenMgrService', () => {
  let service: TokenMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
