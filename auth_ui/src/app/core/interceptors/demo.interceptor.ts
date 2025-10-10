import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { DemoDataService } from '../services/demo-data.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class DemoInterceptor implements HttpInterceptor {
  constructor(
    private demoDataService: DemoDataService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip demo for production or when demo mode is disabled
    if (this.isProduction() || !this.isDemoMode()) {
      return next.handle(request);
    }

    // Handle demo data requests
    if (request.url.includes('/api/users')) {
      return this.handleUsersRequest(request);
    }

    if (request.url.includes('/api/roles')) {
      return this.handleRolesRequest(request);
    }

    if (request.url.includes('/api/permissions')) {
      return this.handlePermissionsRequest(request);
    }

    if (request.url.includes('/api/login/')) {
      return this.handleLoginRequest(request);
    }

    if (request.url.includes('/api/logout/')) {
      return this.handleLogoutRequest(request);
    }

    if (request.url.includes('/api/user/')) {
      return this.handleUserProfileRequest(request);
    }

    // Pass through other requests
    return next.handle(request);
  }

  private handleUsersRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    try {
      switch (request.method) {
        case 'GET':
          return this.demoDataService.getUsers(request.params as any).pipe(
            delay(500),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'POST':
          return this.demoDataService.createUser(request.body).pipe(
            delay(800),
            map(data => new HttpResponse({ status: 201, body: data }))
          );
        case 'PATCH':
          const userId = this.extractIdFromUrl(request.url);
          return this.demoDataService.updateUser(userId, request.body).pipe(
            delay(600),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'DELETE':
          const deleteId = this.extractIdFromUrl(request.url);
          return this.demoDataService.deleteUser(deleteId).pipe(
            delay(500),
            map(() => new HttpResponse({ status: 204 }))
          );
        default:
          return throwError(() => new Error('Method not allowed'));
      }
    } catch (error) {
      return throwError(() => error).pipe(delay(300));
    }
  }

  private handleRolesRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    try {
      switch (request.method) {
        case 'GET':
          if (request.url.includes('/permissions/')) {
            const roleId = this.extractIdFromUrl(request.url);
            return this.demoDataService.getRolePermissions(roleId).pipe(
              delay(400),
              map(data => new HttpResponse({ status: 200, body: data }))
            );
          }
          return this.demoDataService.getRoles(request.params as any).pipe(
            delay(500),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'POST':
          if (request.url.includes('/assign_permissions/')) {
            const roleId = this.extractIdFromUrl(request.url);
            return this.demoDataService.assignPermissions(roleId, request.body.permissions).pipe(
              delay(600),
              map(data => new HttpResponse({ status: 200, body: data }))
            );
          }
          if (request.url.includes('/remove_permissions/')) {
            const roleId = this.extractIdFromUrl(request.url);
            return this.demoDataService.removePermissions(roleId, request.body.permissions).pipe(
              delay(600),
              map(data => new HttpResponse({ status: 200, body: data }))
            );
          }
          return this.demoDataService.createRole(request.body).pipe(
            delay(800),
            map(data => new HttpResponse({ status: 201, body: data }))
          );
        case 'PATCH':
          const roleId = this.extractIdFromUrl(request.url);
          return this.demoDataService.updateRole(roleId, request.body).pipe(
            delay(600),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'DELETE':
          const deleteId = this.extractIdFromUrl(request.url);
          return this.demoDataService.deleteRole(deleteId).pipe(
            delay(500),
            map(() => new HttpResponse({ status: 204 }))
          );
        default:
          return throwError(() => new Error('Method not allowed'));
      }
    } catch (error) {
      return throwError(() => error).pipe(delay(300));
    }
  }

  private handlePermissionsRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    try {
      switch (request.method) {
        case 'GET':
          return this.demoDataService.getPermissions(request.params as any).pipe(
            delay(500),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'POST':
          return this.demoDataService.createPermission(request.body).pipe(
            delay(800),
            map(data => new HttpResponse({ status: 201, body: data }))
          );
        case 'PATCH':
          const permissionId = this.extractIdFromUrl(request.url);
          return this.demoDataService.updatePermission(permissionId, request.body).pipe(
            delay(600),
            map(data => new HttpResponse({ status: 200, body: data }))
          );
        case 'DELETE':
          const deleteId = this.extractIdFromUrl(request.url);
          return this.demoDataService.deletePermission(deleteId).pipe(
            delay(500),
            map(() => new HttpResponse({ status: 204 }))
          );
        default:
          return throwError(() => new Error('Method not allowed'));
      }
    } catch (error) {
      return throwError(() => error).pipe(delay(300));
    }
  }

  private handleLoginRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const { username, password } = request.body;
    
    // Demo authentication
    if (username === 'admin' && password === 'admin123') {
      const response = {
        access: this.generateMockToken('admin'),
        refresh: this.generateMockToken('refresh'),
        user: {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'System',
          last_name: 'Administrator'
        }
      };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(1000));
    }
    
    if (username === 'manager' && password === 'manager123') {
      const response = {
        access: this.generateMockToken('manager'),
        refresh: this.generateMockToken('refresh'),
        user: {
          id: 2,
          username: 'manager',
          email: 'manager@example.com',
          first_name: 'John',
          last_name: 'Manager'
        }
      };
      return of(new HttpResponse({ status: 200, body: response })).pipe(delay(1000));
    }

    return throwError(() => new Error('Invalid credentials')).pipe(delay(1000));
  }

  private handleLogoutRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(new HttpResponse({ status: 200, body: {} })).pipe(delay(500));
  }

  private handleUserProfileRequest(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    // Simulate getting current user profile
    const currentUser = {
      id: 1,
      username: 'admin',
      email: 'admin@example.com',
      first_name: 'System',
      last_name: 'Administrator',
      roles: this.roles.slice(0, 1) // Admin role
    };
    
    return of(new HttpResponse({ status: 200, body: currentUser })).pipe(delay(300));
  }

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/([0-9]+)\//);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  private generateMockToken(type: string): string {
    const payload = {
      token_type: type,
      exp: Math.floor(Date.now() / 1000) + (type === 'admin' ? 300 : 86400), // 5 min for access, 24h for refresh
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString(36).substr(2, 9)
    };
    
    return btoa(JSON.stringify({
      header: { alg: 'HS256', typ: 'JWT' },
      payload: payload,
      signature: 'demo-signature'
    }));
  }

  private isProduction(): boolean {
    return false; // Set to true for production
  }

  private isDemoMode(): boolean {
    // You can add logic here to enable/disable demo mode
    // For example, check localStorage or environment config
    return true; // Always enable demo mode for this setup
  }
}

// Helper function to map observable data to HttpResponse
function map<T, R>(project: (value: T) => R) {
  return (source: Observable<T>) => 
    new Observable<R>(observer => 
      source.subscribe({
        next: value => observer.next(project(value)),
        error: err => observer.error(err),
        complete: () => observer.complete()
      })
    );
}