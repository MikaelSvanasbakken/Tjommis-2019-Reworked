import { TestBed } from '@angular/core/testing';

import { TjommisHubService } from './tjommis-hub.service';

describe('TjommisHubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TjommisHubService = TestBed.get(TjommisHubService);
    expect(service).toBeTruthy();
  });
});
