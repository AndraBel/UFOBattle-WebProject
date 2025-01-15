import { TestBed } from '@angular/core/testing';

import { PlayMgrService } from './play-mgr.service';

describe('PlayMgrService', () => {
  let service: PlayMgrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayMgrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
