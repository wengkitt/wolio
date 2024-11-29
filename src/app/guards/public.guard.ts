import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    map((user) => {
      if (user) {
        router.navigate(['/main']);
        return false;
      } else {
        return true;
      }
    })
  );
};
