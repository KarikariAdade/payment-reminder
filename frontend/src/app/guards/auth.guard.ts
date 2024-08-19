import {ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';

import {AuthService} from "../services/auth/auth.service";

import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router)

  if (authService.isAuthenticated()) {

    const tokenParts:any = authService.getToken()?.split('.');
    console.log('token parts', tokenParts);

    console.log(authService.isExpired(), 'expiry')

    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const expirationDate: number = payload.exp * 1000;
      const currentTime: number = new Date().getTime();

      if (expirationDate < currentTime || authService.isExpired()) {

        return router.navigate(['/auth/login']);

      }else{

        return true;

      }

    } else {
      return router.navigate(['/auth/login']);
    }

  }else{
    return router.navigate(['/auth/login']);
  }
};
