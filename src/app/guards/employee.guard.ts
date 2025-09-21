import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const employeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.isAuthenticated() && auth.currentUser()?.role === 'employee') {
    return true;
  }
  
  return router.createUrlTree(['/dashboard']);
};
