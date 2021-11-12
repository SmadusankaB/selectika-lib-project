import { TestBed } from '@angular/core/testing';

import { SelectikaLibService } from './selectika-lib.service';

describe('SelectikaLibService', () => {
  let service: SelectikaLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectikaLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
