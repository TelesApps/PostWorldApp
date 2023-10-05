import { TestBed } from '@angular/core/testing';

import { NeonDataService } from './neon-data.service';

describe('NeonDataService', () => {
  let service: NeonDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeonDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
