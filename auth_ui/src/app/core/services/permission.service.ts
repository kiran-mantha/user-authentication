import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission, PermissionCreate, PermissionUpdate } from '../models/permission.model';
import { PaginatedResponse } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly API_URL = '/api/permissions';

  constructor(private http: HttpClient) {}

  getPermissions(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    api_endpoint?: string;
    http_method?: string;
  }): Observable<PaginatedResponse<Permission>> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] !== undefined) {
          httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
        }
      });
    }

    return this.http.get<PaginatedResponse<Permission>>(this.API_URL, { params: httpParams });
  }

  getPermission(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.API_URL}/${id}/`);
  }

  createPermission(permission: PermissionCreate): Observable<Permission> {
    return this.http.post<Permission>(this.API_URL, permission);
  }

  updatePermission(id: number, permission: PermissionUpdate): Observable<Permission> {
    return this.http.patch<Permission>(`${this.API_URL}/${id}/`, permission);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}/`);
  }

  getAvailableHttpMethods(): string[] {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
  }
}