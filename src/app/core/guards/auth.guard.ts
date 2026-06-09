import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const expiresUtc = authService.getExpiresUtc();
    
    if (expiresUtc) {
      const expiryTime = new Date(expiresUtc).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;
      
      const oneMinuteInMs = 60 * 1000;
      
      if (timeUntilExpiry <= oneMinuteInMs) {
        authService.logout();
        return false;
      }
      
      return true;
    }
  }

  router.navigate(['/sign-in']);
  return false;
};
