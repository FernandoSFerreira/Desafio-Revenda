import { TestBed } from '@angular/core/testing';

import { HttpProvider } from './http-provider';

describe('HttpProvider', () => {
  let service: HttpProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
