import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredPermission = route.data['permission'];
    const requiredRole = route.data['role'];

    return this.authService.authState$.pipe(
      take(1),
      map((authState) => {
        if (!authState.isAuthenticated) {
          return this.router.createUrlTree(['/auth/login']);
        }

        // Check role requirement
        if (requiredRole && !this.authService.hasRole(requiredRole)) {
          return this.router.createUrlTree(['/unauthorized']);
        }

        // Check permission requirement
        if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
          return this.router.createUrlTree(['/unauthorized']);
        }

        return true;
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    return this.canActivate(route);
  }
}