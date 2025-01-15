import { TestBed } from '@angular/core/testing';

import { GameSettingsServiceService } from './game-settings-service.service';

describe('GameSettingsServiceService', () => {
  let service: GameSettingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSettingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
