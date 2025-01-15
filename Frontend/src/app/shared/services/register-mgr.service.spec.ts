import { TestBed } from '@angular/core/testing';

import { RegisterMgrService } from './register-mgr.service';

describe('RegisterMgrService', () => {
  let service: RegisterMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
