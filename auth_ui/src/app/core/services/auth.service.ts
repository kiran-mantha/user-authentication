import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthState, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../models/auth.model';
import { AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null
  });
  
  public authState$ = this.authStateSubject.asObservable();
  
  private refreshTokenTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const accessToken = localStorage.getItem(this.TOKEN_KEY);
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (accessToken && refreshToken) {
      this.validateTokenAndGetUser().subscribe({
        next: (user) => {
          this.updateAuthState({
            isAuthenticated: true,
            user,
            accessToken,
            refreshToken
          });
          this.scheduleTokenRefresh();
        },
        error: () => {
          this.clearAuth();
        }
      });
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login/`, credentials).pipe(
      tap((response) => {
        this.updateAuthState({
          isAuthenticated: true,
          user: response.user,
          accessToken: response.access,
          refreshToken: response.refresh
        });
        this.storeTokens(response.access, response.refresh);
        this.scheduleTokenRefresh();
      }),
      catchError((error) => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (refreshToken) {
      return this.http.post(`${this.API_URL}/logout/`, { refresh: refreshToken }).pipe(
        tap(() => {
          this.clearAuth();
          this.router.navigate(['/auth/login']);
        }),
        catchError((error) => {
          this.clearAuth();
          this.router.navigate(['/auth/login']);
          return of(null);
        })
      );
    } else {
      this.clearAuth();
      this.router.navigate(['/auth/login']);
      return of(null);
    }
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      this.clearAuth();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/token/refresh/`, {
      refresh: refreshToken
    }).pipe(
      map((response) => response.access),
      tap((newAccessToken) => {
        localStorage.setItem(this.TOKEN_KEY, newAccessToken);
        this.updateAuthState({
          ...this.authStateSubject.value,
          accessToken: newAccessToken
        });
        this.scheduleTokenRefresh();
      }),
      catchError((error) => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  getCurrentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.API_URL}/user/`);
  }

  validateTokenAndGetUser(): Observable<AuthUser> {
    return this.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUserData(): any {
    return this.authStateSubject.value.user;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUserData();
    return user?.roles?.some((role: any) => role.name === roleName) || false;
  }

  hasPermission(permissionCodename: string): boolean {
    const user = this.getCurrentUserData();
    return user?.roles?.some((role: any) => 
      role.permissions?.some((perm: any) => perm.codename === permissionCodename)
    ) || false;
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null
    });
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  private updateAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }

    const token = this.getAccessToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = payload.exp * 1000;
      const now = Date.now();
      const refreshTime = expiryTime - now - 60000; // Refresh 1 minute before expiry

      if (refreshTime > 0) {
        this.refreshTokenTimeout = setTimeout(() => {
          this.refreshAccessToken().subscribe({
            error: () => {
              this.clearAuth();
              this.router.navigate(['/auth/login']);
            }
          });
        }, refreshTime);
      }
    }
  }
}