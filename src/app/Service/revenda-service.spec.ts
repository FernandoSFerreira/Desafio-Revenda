import { TestBed } from '@angular/core/testing';

import { RevendaService } from './revenda-service';

describe('RevendaService', () => {
  let service: RevendaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevendaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
