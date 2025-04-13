import { TestBed } from '@angular/core/testing';

import { DevEngineService } from './dev-engine.service';

describe('DevEngineService', () => {
  let service: DevEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
