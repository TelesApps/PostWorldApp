import { TestBed } from '@angular/core/testing';

import { InformUserService } from './inform-user.service';

describe('InformUserService', () => {
  let service: InformUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
