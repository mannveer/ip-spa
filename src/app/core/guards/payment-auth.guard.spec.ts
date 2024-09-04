import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { paymentAuthGuard } from './payment-auth.guard';

describe('paymentAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => paymentAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
