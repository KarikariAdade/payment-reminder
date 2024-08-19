import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth/auth.service";
import {inject} from "@angular/core";

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  if (authService.isAuthenticated() && !authService.isExpired()) {
    return router.navigate(['/dashboard'])
  }else {
    return true;
  }
};
