import { TestBed } from '@angular/core/testing';

import { UserFileInfoService } from './user-file-info.service';

describe('UserFileInfoService', () => {
  let service: UserFileInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFileInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
